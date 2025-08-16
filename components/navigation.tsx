// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navigation() {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header")?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/" onClick={handleHomeClick}>
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.span>
      </Link>
      <Link href="#features" onClick={(e) => handleAnchorClick(e, "features")}>
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Features
        </motion.span>
      </Link>
      <Link href="#how-it-works" onClick={(e) => handleAnchorClick(e, "how-it-works")}>
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          How It Works
        </motion.span>
      </Link>
      <Link href="#Team" onClick={(e) => handleAnchorClick(e, "Team")}>
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Team
        </motion.span>
      </Link>
      <Link href="/about">
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          About Us
        </motion.span>
      </Link>
      <Link href="/careers">
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Careers
        </motion.span>
      </Link>
      <Link href="/contact">
        <motion.span
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.span>
      </Link>
    </nav>
  );
}