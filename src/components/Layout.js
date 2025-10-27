import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import LogoLight from "../assets/K-SCREEN-LOGO.png";
import LogoDark from "../assets/K-SCREEN-LOGO-W.png";

export default function Layout({ children }) {
  	const { theme, toggleTheme } = useContext(ThemeContext);

  	return (
		<div className={`flex min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
		{/* Sidebar */}
		<aside className={`w-64 p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
			<div className="flex items-center justify-between">
			<img
				src={theme === "dark" ? LogoDark : LogoLight}
				alt="KSCREEN Logo"
				className="w-40 mb-6"
			/>
			</div>

			<nav className="space-y-3">
			<a href="#" className="block font-medium hover:text-blue-500">Dashboard</a>
			<a href="#" className="block font-medium hover:text-blue-500">Organizations</a>
			<a href="#" className="block font-medium hover:text-blue-500">Product Types</a>
			<a href="#" className="block font-medium hover:text-blue-500">Products</a>
			</nav>
		</aside>

		{/* Main Content */}
		<main className="flex-1 p-8">
			<header className="flex justify-between items-center mb-6">
			<h1 className="text-2xl font-bold">Admin Panel</h1>
			<button
				onClick={toggleTheme}
				className="px-3 py-2 rounded-md border border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
			>
				{theme === "light" ? "🌙 Dark" : "☀️ Light"}
			</button>
			</header>
			{children}
		</main>
		</div>
  	);
}
