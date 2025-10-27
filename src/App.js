import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";

function App() {
  	return (
		<ThemeProvider>
		<Layout>
			<div className="p-4">
			<h2 className="text-xl font-semibold mb-2">Welcome to KSCREEN Admin!</h2>
			<p className="text-gray-600 dark:text-gray-300">
				Manage organizations, product types, and products here.
			</p>
			</div>
		</Layout>
		</ThemeProvider>
  	);
}

export default App;

