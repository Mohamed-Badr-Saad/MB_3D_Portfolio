import { Link } from "react-router-dom";
import { logo, menu, close } from "../assets";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { useState } from "react";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}
    >
      <div className="w-full flex justify-between items-center mx-auto max-w-7xl">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="w-15 h-12 rounded-full object-contain"
          />
          <p className="text-white text-[18px] font-bold cursor-pointer ">
            Mohamed Badr{" "}
            <span className="text-[14px] font-light sm:block hidden">
              {" "}
              Software Engineer
            </span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10 ">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`${
                active === link.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => {
                setActive(link.title);
              }}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="cursor-pointer object-contain w-[28px] h-[28px]"
            onClick={() => setToggle(!toggle)}
          />
          <ul
            className={`${
              toggle ? "flex" : "hidden"
            } p-6 black-gradient absolute top-20 right-5 rounded-xl sidebar list-none flex flex-col gap-4`}
          >
            {navLinks.map((link) => (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-white" : "text-secondary"
                } hover:text-white font-poppins text-[16px] font-medium cursor-pointer`}
                onClick={() => {
                  setActive(link.title);
                  setToggle(!toggle);
                }}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
