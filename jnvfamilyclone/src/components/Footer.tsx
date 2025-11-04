import Link from "next/link";
import { HiPhotograph, HiCalendar, HiBookOpen, HiHeart } from "react-icons/hi";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Alumni", href: "/alumni" },
    { name: "Gallery", href: "/gallery" },
    { name: "Events", href: "/events" },
    { name: "Stories", href: "/stories" },
    { name: "Contact", href: "/contact" },
];

const socialLinks = [
    { name: "Facebook", href: "#", icon: <FaFacebook />, color: "hover:text-green-600" },
    { name: "Instagram", href: "#", icon: <FaInstagram />, color: "hover:text-pink-500" },
    { name: "Twitter", href: "#", icon: <FaTwitter />, color: "hover:text-yellow-500" },
    { name: "LinkedIn", href: "#", icon: <FaLinkedin />, color: "hover:text-green-800" },
];

const communityLinks = [
    { name: "Gallery", href: "/gallery", icon: <HiPhotograph className="w-4 h-4 inline-block mr-1" /> },
    { name: "Events", href: "/events", icon: <HiCalendar className="w-4 h-4 inline-block mr-1" /> },
    { name: "Helping Hands", href: "/community/helping-hands", icon: <HiHeart className="w-4 h-4 inline-block mr-1" /> },
    { name: "Stories", href: "/community/stories", icon: <HiBookOpen className="w-4 h-4 inline-block mr-1" /> },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-green-100 text-gray-700 py-10 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-2xl font-bold text-green-700 mb-4">JNV Alumni</h3>
                        <p className="text-gray-500 mb-4">
                            Connecting alumni from Jawahar Navodaya Vidyalaya. Building a strong, vibrant community for lifelong relationships and growth.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`text-gray-400 text-2xl transition-colors ${link.color}`}
                                    aria-label={link.name}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-600">Quick Links</h4>
                        <ul className="space-y-2">
                            {navLinks.filter(l => !["Gallery", "Events", "Stories"].includes(l.name)).map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-green-600 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Community Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-600">Community</h4>
                        <ul className="space-y-2">
                            {communityLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        {item.icon}{item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-600">Contact</h4>
                        {/* <p className="text-gray-500 mb-2">Email: <a href="mailto:bhargavinukathoti@gmail.com" className="text-red-700 hover:underline">bhargavinukathoti@gmail.com</a></p> */}
                        {/* <p className="text-gray-500 mb-2">Phone: <a href="tel:+919701645995" className="text-red-700 hover:underline">+91 97016 45995</a></p> */}
                        <p className="text-gray-500">Address: Hyderabad, India</p>
                    </div>
                </div>
                <div className="border-t border-green-100 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JNV Alumni. All rights reserved.</p>
                    <p className="mt-2 ">
                        Designed and Developed by{" "}
                        <span className="font-semibold text-green-700">Srihari Maddineni</span>
                        , from <span className="font-semibold text-red-700">JNV Ongole</span> | {" "}
                        <a href="tel:+916304214514" className="text-blue-700 hover:underline">+91 63042 14514</a>
                    </p>
                </div>
            </div>
        </footer>
    );
} 