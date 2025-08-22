import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink } from 'shards-react';
import classNames from 'classnames';

import SidebarMainNavbar from './SidebarMainNavbar';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { USER_CATEGORIES } from '@/modules/auth/types/auth.types';

interface TipoContribuicao {
  id: string;
  titulo: string;
  categoria: string;
  ativo: boolean;
}

const MainSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  
  // ✨ NOVO: Estado para tipos de contribuição dinâmicos
  const [tiposDisponiveis, setTiposDisponiveis] = useState<TipoContribuicao[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  // ✨ NOVO: Buscar tipos quando usuário muda
  useEffect(() => {
    if (user?.id && user?.categoria !== 'ADMIN') {
      fetchTiposParaCategoria();
    } else {
      setTiposDisponiveis([]);
    }
  }, [user]);

  const fetchTiposParaCategoria = async () => {
    setLoadingTipos(true);
    try {
      const response = await fetch(`/api/contribuicoes/user/${user?.id}/tipos-disponiveis`);
      const data = await response.json();
      
      if (data.success) {
        setTiposDisponiveis(data.data);
      } else {
        console.error('Erro ao buscar tipos:', data.error);
        setTiposDisponiveis([]);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos para categoria:', error);
      setTiposDisponiveis([]);
    } finally {
      setLoadingTipos(false);
    }
  };

  // ✨ NOVO: Mapeamento de ícones por tipo de contribuição
  const getIconForTipo = (titulo: string): string => {
    const iconMap: Record<string, string> = {
      'Habilidades': 'star',
      'Oportunidades': 'work',
      'Projetos': 'account_balance',
      'Eventos': 'event',
      'Notícias': 'article',
      'Cursos': 'menu_book',
      'Suporte': 'favorite',
      'Workshops': 'build'
    };
    return iconMap[titulo] || 'assignment';
  };

  // ✨ NOVO: Obter ícone da categoria de usuário
  const getCategoryIcon = (categoria?: string): string => {
    const iconMap: Record<string, string> = {
      'IMIGRANTE': 'language',
      'EMPRESA': 'business',
      'MUNICIPIO': 'location_city',
      'ACADEMIA': 'school',
      'FAMILIA_ACOLHIMENTO': 'family_restroom'
    };
    return iconMap[categoria || ''] || 'person';
  };

  // ✨ NOVO: Obter label da categoria
  const getCategoryLabel = (categoria?: string): string => {
    const labelMap: Record<string, string> = {
      'IMIGRANTE': 'Imigrante',
      'EMPRESA': 'Empresa',
      'MUNICIPIO': 'Município',
      'ACADEMIA': 'Academia',
      'FAMILIA_ACOLHIMENTO': 'Família'
    };
    return labelMap[categoria || ''] || 'Usuário';
  };

  // Itens de navegação base
  const baseSidebarNavItems = [
    {
      title: 'Site Madrilusa',
      to: '/',
      iconClass: 'public',
      htmlAfter: ''
    },
    {
      title: 'Dashboard',
      to: '/app/dashboard',
      iconClass: 'dashboard',
      htmlAfter: ''
    },
    {
      title: 'Perfil do Utilizador',
      to: '/app/profile', 
      iconClass: 'person',
      htmlAfter: ''
    }
  ];

  // ✨ NOVO: Menu dinâmico por categoria
  const generateCategoryMenuItems = () => {
    const categoryMenuItems = [];

    // Item de perfil (sempre presente para não-admin)
    if (user?.categoria && user.categoria !== 'ADMIN') {
      const perfilRoute = `/app/perfil-${user.categoria.toLowerCase().replace('_acolhimento', '')}`;
      
      categoryMenuItems.push({
        title: `Perfil de ${getCategoryLabel(user.categoria)}`,
        to: perfilRoute,
        iconClass: getCategoryIcon(user.categoria),
        htmlAfter: ''
      });
    }

    // Items de contribuição (dinâmicos baseados nos tipos disponíveis)
    if (loadingTipos) {
      categoryMenuItems.push({
        title: 'Carregando tipos...',
        to: '#',
        iconClass: 'hourglass_empty',
        htmlAfter: '',
        disabled: true
      });
    } else {
      tiposDisponiveis.forEach(tipo => {
        categoryMenuItems.push({
          title: tipo.titulo,
          to: `/app/contribuicoes/${tipo.id}`,
          iconClass: getIconForTipo(tipo.titulo),
          htmlAfter: ''
        });
      });
    }

    return categoryMenuItems;
  };
  
  // ✨ NOVO: Gerar menu dinâmico baseado na categoria
  const generateAdminMenuItems = () => {
    if (user?.categoria !== USER_CATEGORIES.ADMIN) return [];
    
    return [
      {
        title: 'Dashboard Admin',
        to: '/app/admin-dashboard',
        iconClass: 'admin_panel_settings',
        htmlAfter: ''
      },
      {
        title: 'Gestão de Usuários',
        to: '/app/user-management',
        iconClass: 'group',
        htmlAfter: ''
      },
      {
        title: 'Tipos de Contribuição',
        to: '/app/tipos-contribuicao',
        iconClass: 'category',
        htmlAfter: ''
      },
      {
        title: 'Gestão de Tags',
        to: '/app/tags-management',
        iconClass: 'local_offer',
        htmlAfter: ''
      }
    ];
  };
  
  // ✨ NOVO: Combinar menus dinamicamente
  const categoryMenuItems = user?.categoria === 'ADMIN' 
    ? generateAdminMenuItems()
    : generateCategoryMenuItems();
    
  const sidebarNavItems = [...baseSidebarNavItems, ...categoryMenuItems];

  const classes = classNames(
    'main-sidebar',
    'px-0',
    'col-12',
    menuVisible && 'open'
  );

  return (
    <Col
      tag="aside"
      className={classes}
      lg={{ size: 2 }}
      md={{ size: 3 }}
    >
      <SidebarMainNavbar />
      
      {/* Navigation Items */}
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {sidebarNavItems.map((item, idx) => (
            <NavItem key={idx}>
              <NavLink
                tag="a"
                className={classNames(
                  location.pathname === item.to && 'active'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.to);
                }}
                href={item.to}
              >
                <span className="sidebar-nav-item-icon">
                  <i className="material-icons">{item.iconClass}</i>
                </span>
                <span>{item.title}</span>
                {item.htmlAfter && (
                  <span 
                    className="sidebar-nav-item-badge"
                    dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
                  />
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        
        {/* Barra de Logos Institucional */}
        <div className="sidebar-logos" style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '10px',
          width: 'calc(16.66667% - 20px)',
          textAlign: 'center',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/logo_madrilusa/barradelogosmadrilusa.png"
            alt="Parceiros Madrilusa"
            style={{ 
              width: '95%', 
              height: 'auto',
              maxWidth: '280px'
            }}
          />
        </div>
      </div>
    </Col>
  );
};

export default MainSidebar; 