import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/docs', label: 'Docs' },
        { to: '/ocr', label: 'Image OCR' },
        { to: '/team', label: 'Team' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className='relative flex items-center justify-between w-full md:px-16 lg:px-24 xl:px-32 py-4 px-4'>
            <a aria-label='DocReader Logo' onClick={()=>navigate('/')} className='cursor-pointer z-50'>
                <img src={logo} alt='DocReader Logo' className='h-10' />
            </a>

            {/* DESKTOP LINKS */}
            <div className='hidden md:flex items-center gap-8 font-medium'>
                {navLinks.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`transition ${isActive(to) ? 'text-indigo-600' : 'hover:text-indigo-500'}`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            <button className='hidden md:block px-6 py-2 bg-white hover:bg-gray-200 transition active:scale-95 rounded-full border border-gray-600'>Get Started</button>

            {/* MOBILE BACKDROP */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* MOBILE SLIDE-IN MENU */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Close button */}
                <div className='flex items-center justify-between px-5 py-5 border-b border-gray-100'>
                    <span className='text-sm font-semibold text-gray-400 uppercase tracking-wider'>Menu</span>
                    <button
                        aria-label='close menu'
                        className='p-1.5 rounded-lg hover:bg-gray-100 transition'
                        onClick={() => setMenuOpen(false)}
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M18 6 6 18M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <div className='flex flex-col py-4'>
                    {navLinks.map(({ to, label }, index) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-3 px-6 py-3.5 text-base font-medium transition-colors ${
                                isActive(to)
                                    ? 'text-indigo-600 bg-indigo-50 border-r-2 border-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-500'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* CTA at bottom of mobile menu */}
                <div className='absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100'>
                    <button
                        onClick={() => { setMenuOpen(false); navigate('/'); }}
                        className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition active:scale-95'
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* BURGER MENU */}
            <button aria-label='menu burger' className='p-1.5 rounded-lg hover:bg-gray-100 transition md:hidden z-50' onClick={() => setMenuOpen(true)}>
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M3 12h18M3 18h18M3 6h18' />
                </svg>
            </button>
        </nav>
    )
}

export default Navbar