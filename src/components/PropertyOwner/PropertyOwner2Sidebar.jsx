import React, { useEffect, useState } from "react";
import { useProfile } from '../../context/ProfileContext';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../../helper/ThemeToggleButton";
import '../../dashboard.css';
import LogoutButton from "../LogoutButton";
import PropertyLimitBanner from "../../pages1/PropertiesLimitBanner";
import '../../custom.css';
import UpgradePlanPopup from '../child/UpgradePlanPopup';
import { useUpgradePlanPopupState } from './PropertyOwner2Sidebar.UpgradePlanPopupState';
import { IoDiamondOutline } from "react-icons/io5";

const userPopupStyles = `
  .user-popup-container {
    position: relative;
  }
  
  .sidebar-bottom-user {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #eee;
    background-color: inherit;
  }
  
  .dark-mode .sidebar-bottom-user {
    border-top: 1px solid #2a2a3c;
  }
  
  /* Make the user popup behave like other sidebar items when collapsed */
  .sidebar.active .sidebar-bottom-user .user-popup-container a span {
    display: none;
  }
  
  .sidebar.active .sidebar-bottom-user {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
  
  .sidebar.active .sidebar-bottom-user .user-popup-container {
    width: auto;
  }
  
  .user-popup-card {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 200px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, -10px);
    transition: all 0.3s ease;
    margin-bottom: 10px;
  }
  
  .dark-mode .user-popup-card {
    background-color: #1e1e2d;
    color: #fff;
  }
  
  .user-popup-card.show {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
  
  .user-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
  }
  
  .dark-mode .user-popup-header {
    border-bottom: 1px solid #2a2a3c;
  }
  
  .user-popup-header h6 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  
  .dark-mode .close-btn {
    color: #aaa;
  }
  
  .user-popup-menu {
    list-style: none;
    padding: 10px 0;
    margin: 0;
  }
  
  .user-popup-menu li {
    padding: 0;
    margin: 0;
  }
  
  .user-popup-menu li a,
  .user-popup-menu li button {
    display: flex;
    align-items: center;
    padding: 8px 15px;
    color: #333;
    text-decoration: none;
    transition: background-color 0.2s;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
  }
  
  .dark-mode .user-popup-menu li a,
  .dark-mode .user-popup-menu li button {
    color: #d0d0d0;
  }
  
  .user-popup-menu li a:hover,
  .user-popup-menu li button:hover {
    background-color: #f5f5f5;
  }
  
  .dark-mode .user-popup-menu li a:hover,
  .dark-mode .user-popup-menu li button:hover {
    background-color: #2a2a3c;
  }
  
  .user-popup-menu li a .icon,
  .user-popup-menu li button .icon {
    margin-right: 10px;
  }
`;



const PropertyOwner2Sidebar = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  const { profileImage } = useProfile();
  let [mobileMenu, setMobileMenu] = useState(false);
  let [userPopupOpen, setUserPopupOpen] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const { status, daysLeft, planDetails } = useUpgradePlanPopupState();
  const location = useLocation(); // Hook to get the current route

  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    // Add the CSS styles to the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = userPopupStyles;
    document.head.appendChild(styleElement);

    // Clean up function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      {showUpgradePopup && (
        <UpgradePlanPopup
          status={status}
          daysLeft={daysLeft}
          planDetails={planDetails}
          onClose={() => setShowUpgradePopup(false)}
        />
      )}
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
              src='/assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='/assets/images/logo-light.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            <li>
              <NavLink to='/dashboard' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Dashboard</span>
              </NavLink>
              
            </li>
            <li>
              <NavLink to='/property-list-property-owner' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='material-symbols:home-work-outline' className='menu-icon' />
                <span>Property</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/tenant-list' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='mdi:account-group-outline' className='menu-icon' />
                <span>Tenant</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/lease-list' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='mdi:file-document-outline' className='menu-icon' />
                <span>Lease</span>
              </NavLink>
            </li>


           
           {/*<li>
              <NavLink
                to='/email'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:email' className='menu-icon' />
                <span>Email</span>
              </NavLink>
            </li>*/}
            {/*<li>
              <NavLink
                to='/chat-message'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='bi:chat-dots' className='menu-icon' />
                <span>Chat</span>
              </NavLink>
            </li>
            */}
            <li>
              <NavLink
                to='/propertyowner-calender-main'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='solar:calendar-outline' className='menu-icon' />
                <span>Calendar</span>
              </NavLink>
            </li>
           

            {/* Invoice Dropdown */}
            <li>
                          <NavLink to='/invoice-list-property-owner' className={(navData) => (navData.isActive ? "active-page" : "")}>
                            <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                            <span>Invoice</span>
                          </NavLink>
                          
                        </li>
            
         
               <li>
                          <NavLink to='/MaintainancePagePropertyOwner' className={(navData) => (navData.isActive ? "active-page" : "")}>
                            <Icon icon='mdi:wrench-outline' className='menu-icon' />
                            <span>Maintainace Request</span>
                          </NavLink>
                          
                        </li>
                        <li>
                          <NavLink to='/property-manager-list' className={(navData) => (navData.isActive ? "active-page" : "")}>
                            <Icon icon='mdi:account-cog' className='menu-icon' />
                            <span>Property Manager</span>
                          </NavLink>
                          
                        </li>
                      

          
            <li>
              <NavLink to='/tenant-screening/list' className={(navData) => (navData.isActive ? "active-page" : "")}>
                <Icon icon='mdi:account-search' className='menu-icon' />
                <span>Tenant Screening </span>
              </NavLink>
              </li>   
           
       
  
           
     

           

              

       
          
          
                
               
         
        
        

      
            
         
                
             

                
              

          
              

           
         
             

         

             
        


     

            {/* Settings Dropdown 
            <li>
                         <NavLink to='/propertyownercompanylayer' className={(navData) => (navData.isActive ? "active-page" : "")}>
                           <Icon
                             icon='icon-park-outline:setting-two'
                             className='menu-icon'
                           />
                           <span>Settings</span>
                         </NavLink>
                         
                         
                            
                          
                          
                            
                       
                       </li>*/}

          

          </ul>
        </div>
        <div className="sidebar-bottom-user mt-auto">
            <div className='user-popup-container'>
              <a href='#' style={{paddingLeft: '15px'}} className="d-flex align-items-center" onClick={(e) => {
                e.preventDefault();
                setUserPopupOpen(!userPopupOpen);
              }}>
                {(() => {
                  let user = null;
                  try {
                    user = JSON.parse(localStorage.getItem('user'));
                  } catch (e) {}
                  const username = user?.username || 'User';
                  return (
                    <>
                      <Icon icon='solar:user-linear' className='menu-icon' />
                      <span>{username}</span>
                    </>
                  );
                })()}
              </a>
              <div className={`user-popup-card ${userPopupOpen ? 'show' : ''}`}>
                <div className='user-popup-header'>
                  <button onClick={() => setUserPopupOpen(false)} className='close-btn'>
                    <Icon icon='radix-icons:cross-1' />
                  </button>
                </div>
                <ul className='user-popup-menu'>
  <li>
    <Link to='/view-profile-propertyowner' onClick={() => setUserPopupOpen(false)}>
      <Icon icon='solar:user-linear' className='icon text-xl' />
      <span>My Profile</span>
    </Link>
  </li>
 
  <li onClick={() => setUserPopupOpen(false)}>
    <LogoutButton />
  </li>
</ul>
              </div>
            </div>
            {/* Profile dropdown end */}
          </div>
        </aside>

        <main
          className={sidebarActive ? "dashboard-main active sidebar-layout" : "dashboard-main sidebar-layout"}
        >
          <div className='navbar-header'>
            <div className='row align-items-center justify-content-between'>
              <div className='col-auto'>
                <div className='d-flex flex-wrap align-items-center gap-4'>
                  <button
                    type='button'
                    className='sidebar-toggle'
                    onClick={sidebarControl}
                  >
                    {sidebarActive ? (
                      <Icon
                        icon='iconoir:arrow-right'
                        className='icon text-2xl non-active'
                      />
                    ) : (
                      <Icon
                        icon='heroicons:bars-3-solid'
                        className='icon text-2xl non-active '
                      />
                    )}
                  </button>
                  
                </div>
              </div>
              <div className='col-auto'>
                <div className='d-flex flex-wrap align-items-center gap-3'>
                  {/* ThemeToggleButton */}
                  {/*<ThemeToggleButton />*/}
                  {/* Notification dropdown end */}
                  <PropertyLimitBanner />
                  <button type="button" onClick={() => setShowUpgradePopup(true)} className="btn ms-2 py-1 px-3" style={{ backgroundColor: '#30314f', color: 'white', fontSize: '0.9rem', minWidth: '110px' }}>
                    <Icon icon='mdi:diamond-outline' style={{ marginRight: 8 }} />
                    Upgrade Plan
                  </button>
                  <div className='dropdown'>
                    <button
                      className='d-flex justify-content-center align-items-center rounded-circle'
                      type='button'
                      data-bs-toggle='dropdown'
                    >
                      <img
                        src='/assets/images/user.png'
                        alt='image_user'
                        className='w-40-px h-40-px object-fit-cover rounded-circle'
                      />
                    </button>
                    <div className='dropdown-menu to-top dropdown-menu-sm'>
                      <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                        <div>
                          {(() => {
                            let user = null;
                            try {
                              user = JSON.parse(localStorage.getItem('user'));
                            } catch (e) {}
                            const username = user?.username || 'User';
                            const userType = user?.type ? user.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'User Type';
                            return (
                              <>
                                <h6 className='text-lg text-primary-light fw-semibold mb-2'>{username}</h6>
                                <span className='text-secondary-light fw-medium text-sm'>{userType}</span>
                              </>
                            );
                          })()}
                        </div>
                        <button type='button' className='hover-text-danger'>
                          <Icon
                            icon='radix-icons:cross-1'
                            className='icon text-xl'
                          />
                        </button>
                      </div>
                      <ul className='to-top-list'>
                        <li>
                          <Link
                            className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                            to='/view-profile-propertyowner'
                          >
                            <Icon
                              icon='solar:user-linear'
                              className='icon text-xl'
                            />{" "}
                            My Profile
                          </Link>
                        </li>
                        <li>
                          {/*<Link
                            className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                            to='/email'
                          >
                            <Icon
                              icon='tabler:message-check'
                              className='icon text-xl'
                            />{" "}
                            Inbox
                          </Link>*/}
                        </li>
                        {/*<li>
                          <Link
  className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
  to='/propertyownercompanylayer'
>
  <Icon
    icon='icon-park-outline:setting-two'
    className='icon text-xl'
  />
  Settings
</Link>
                        </li>*/}
                        <li>
                          <LogoutButton />
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Profile dropdown end */}
                </div>
              </div>
            </div>
          </div>

          {/* dashboard-main-body */}
          <div className='dashboard-main-body'>{children}</div>

          {/* Footer section */}
          <footer className='d-footer'>
            <div className='row align-items-center justify-content-between'>
              <div className='col-auto'>
                <p className='mb-0 fw-medium text-sm'> 2025 RMS. All Rights Reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </section>
    );
  };

  export default PropertyOwner2Sidebar;
