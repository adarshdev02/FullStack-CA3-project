import Navbar from './Navbar';
import Sidebar from './Sidebar';
export default function Layout({ children }) { return <><Navbar /><div className="app-shell"><Sidebar /><main className="main-content">{children}</main></div></>; }
