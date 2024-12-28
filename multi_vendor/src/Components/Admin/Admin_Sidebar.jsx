import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContextApi } from '../../Context/Context';
import {sideItems} from "../../Static/static.jsx"

const AdminSidebar = () => {
    const { isOpen, toggleSidebar } = useContext(ContextApi);
    const { pathname } = useLocation();

    return (
        <div className='fixed bg-white h-full'>
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={toggleSidebar} />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
                <div className="flex items-center justify-between mt-7 p-4 border-b z-50 lg:hidden"></div>
                <nav className="p-4 space-y-3 fixed">
                    {sideItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} to={item.href} className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                ? 'text-pink-500 bg-pink-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                                onClick={() => isOpen && toggleSidebar()}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
};

export default AdminSidebar;