import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'


export default function Navbar() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<header className="bg-slate-900 text-white">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold tracking-wider">ECHONEWS</div>

				<div className="flex items-center gap-3">
					<nav className="hidden md:flex gap-4 items-center">
						<Link className="text-slate-100 hover:text-white/90" to="/">Home</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Politics">Politics</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Entertainment">Entertainment</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Sports">Sports</Link>
						<Link to="/admin" className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-slate-900 transition">
							Become an Editor
						</Link>
					</nav>

					<button
						onClick={() => setOpen(!open)}
						aria-label="Toggle navigation"
						aria-expanded={open}
						className="p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-white/30"
					>
						<span className={`block w-5 h-4 relative`}>
							<span className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}></span>
							<span className={`absolute left-0 top-1.5 h-0.5 w-full bg-white transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`}></span>
							<span className={`absolute left-0 top-3 h-0.5 w-full bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}></span>
						</span>
					</button>
				</div>
			</div>

			{/* Drawer for small screens */}
			<div
				className={`fixed top-0 right-0 h-full w-72 bg-slate-800 z-50 transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
				onClick={() => setOpen(false)}
			>
				<div className="p-6 h-full flex flex-col gap-4 relative" onClick={(e) => e.stopPropagation()}>
					<button
						className="absolute top-3 right-3 text-2xl text-slate-100 p-1 rounded-md hover:bg-white/5"
						aria-label="Close drawer"
						onClick={() => setOpen(false)}
					>
						×
					</button>

					{/* Logo at top of drawer */}
					<div className="flex items-center gap-3 pb-6 pt-2">
						<h3 className="text-2xl font-bold tracking-wider text-slate-100">ECHONEWS</h3>
						
					</div>

					<Link className="pt-2 text-lg text-slate-100 hover:text-white" to="/" onClick={() => setOpen(false)}>Home</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Politics" onClick={() => setOpen(false)}>Politics</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Entertainment" onClick={() => setOpen(false)}>Entertainment</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Sports" onClick={() => setOpen(false)}>Sports</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link to="/admin" className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-slate-900 transition" onClick={() => setOpen(false)}>Become an Editor</Link>
				</div>
			</div>
		</header>

			
		</>
	)
}
