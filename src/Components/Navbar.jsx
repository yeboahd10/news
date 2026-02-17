import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'


export default function Navbar() {
	const [open, setOpen] = useState(false)
	const [showLoginModal, setShowLoginModal] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loginError, setLoginError] = useState('')
	const navigate = useNavigate()

	const handleLogin = () => {
		setLoginError('')
		if (username === 'Admin' && password === '1234') {
			setShowLoginModal(false)
			setUsername('')
			setPassword('')
			navigate('/admin')
		} else {
			setLoginError('Invalid username or password')
		}
	}

	const closeLoginModal = () => {
		setShowLoginModal(false)
		setUsername('')
		setPassword('')
		setLoginError('')
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleLogin()
		}
	}

	return (
		<>
			<header className="bg-slate-900 text-white">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Bungee' }}>ECHONEWS</div>

				<div className="flex items-center gap-3">
					<nav className="hidden md:flex gap-4 items-center">
						<Link className="text-slate-100  hover:text-white/90" to="/" >Home</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Politics">Politics</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Entertainment">Entertainment</Link>
						<Link className="text-slate-100 hover:text-white/90" to="/category/Sports">Sports</Link>
						<button onClick={() => setShowLoginModal(true)} className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-slate-900 transition">
							Become an Editor
						</button>
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
						<h3 className="text-2xl font-bold tracking-wider text-slate-100" style={{ fontFamily: 'Bungee' }}>ECHONEWS</h3>
						
					</div>

					<Link className="pt-2 text-lg text-slate-100 hover:text-white" to="/" onClick={() => setOpen(false)}>Home</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Politics" onClick={() => setOpen(false)}>Politics</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Entertainment" onClick={() => setOpen(false)}>Entertainment</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<Link className="text-lg text-slate-100 hover:text-white" to="/category/Sports" onClick={() => setOpen(false)}>Sports</Link>
                    <hr className="border-t border-slate-700 my-2" />
					<button onClick={() => { setShowLoginModal(true); setOpen(false); }} className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-slate-900 transition w-full text-left">Become an Editor</button>
				</div>
			</div>
		</header>

		{/* Login Modal */}
		{showLoginModal && (
			<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
					<h2 className="text-2xl font-bold text-slate-900 mb-4">Editor Login</h2>
					
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Username
							</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Enter username"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Enter password"
								className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
							/>
						</div>

						{loginError && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
								{loginError}
							</div>
						)}
					</div>

					<div className="flex gap-3 mt-6">
						<button
							onClick={handleLogin}
							className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium"
						>
							Login
						</button>
						<button
							onClick={closeLoginModal}
							className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition font-medium"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)}
		
		</>
	)
}
