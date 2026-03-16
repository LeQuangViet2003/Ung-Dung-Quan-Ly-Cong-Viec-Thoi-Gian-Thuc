import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Board from './components/Board';
import { LayoutDashboard, Bell, Settings, UserCircle, Search } from 'lucide-react';
import './index.css';

const SOCKET_SERVER_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header glass-panel">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon"></div>
            <h1 className="logo-text">Lê Quang <span>Việt</span></h1>
          </div>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Tìm kiếm công việc..." className="input-field" />
          </div>
        </div>
        
        <div className="header-right">
          <div style={{ position: 'relative' }}>
            <button className="icon-btn btn-ghost" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
            </button>
            {showNotifications && (
              <div className="dropdown-menu glass-panel animate-entrance">
                <h4>Thông báo</h4>
                <div className="dropdown-item">👋 Xin chào Lê Quang Việt!</div>
                <div className="dropdown-item">🚀 Ứng dụng Quản lý công việc đã sẵn sàng.</div>
              </div>
            )}
          </div>
          
          <div style={{ position: 'relative' }}>
            <button className="icon-btn btn-ghost" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={20} />
            </button>
             {showSettings && (
              <div className="dropdown-menu glass-panel animate-entrance">
                <h4>Cài đặt</h4>
                <div className="dropdown-item">Chủ đề: Tối (Dark Space)</div>
                <div className="dropdown-item">Ngôn ngữ: Tiếng Việt</div>
                <div className="dropdown-item text-danger">Đăng xuất</div>
              </div>
            )}
          </div>

          <div className="user-profile">
            <UserCircle size={28} />
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar (mini) */}
        <aside className="app-sidebar glass-panel">
          <nav>
            <button className="sidebar-item active">
              <LayoutDashboard size={20} />
              <span>Bảng</span>
            </button>
          </nav>
        </aside>

        {/* Board Canvas */}
        <main className="board-container">
          <Board socket={socket} />
        </main>
      </div>

      <style>{`
        .app-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          height: 64px;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          z-index: 10;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          background: var(--accent-gradient);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-glow);
        }

        .logo-text {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          color: var(--accent-primary);
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-bar {
          position: relative;
          width: 280px;
          margin-left: 32px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar .input-field {
          padding-left: 38px;
          border-radius: var(--radius-xl);
          background: rgba(0, 0, 0, 0.25);
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .user-profile {
          color: var(--accent-secondary);
          cursor: pointer;
        }

        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .app-sidebar {
          width: 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0;
          border-radius: 0;
          border-top: none;
          border-bottom: none;
          border-left: none;
          z-index: 5;
        }

        .sidebar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 12px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .sidebar-item:hover, .sidebar-item.active {
          color: var(--accent-primary);
          background: var(--glass-highlight);
        }

        .sidebar-item span {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .board-container {
          flex: 1;
          overflow: auto;
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default App;
