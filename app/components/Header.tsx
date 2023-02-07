import { Navbar, useTheme } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import classNames from "classnames";

type NavLink = { path: string; name: string };

function LinkWrapper(p: {
  active?: boolean;
  disabled?: boolean;
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  const theme = useTheme().theme.navbar.link;
  return (
    <li>
      <Link
        className={classNames(
          theme.base,
          {
            [theme.active.on]: p.active,
            [theme.active.off]: !p.active && !p.disabled,
          },
          theme.disabled[p.disabled ? "on" : "off"],
          p.className
        )}
        href={p.href}
      >
        {p.children}
      </Link>
    </li>
  );
}

function HeaderLayout(p: {
  subtitle: ReactNode;
  title: ReactNode;
  links: NavLink[];
}) {
  const router = useRouter();
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {p.title}
        </span>
        <span className="dark:text-white"> : {p.subtitle}</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {links.map((link, index) => {
          return (
            <LinkWrapper
              key={index}
              href={link.path}
              active={router.asPath === link.path}
            >
              {link.name}
            </LinkWrapper>
          );
        })}
      </Navbar.Collapse>
    </Navbar>
  );
}

const links = [
  { path: "/multiplication", name: "Multiplication" },
  { path: "/double", name: "Double" },
  { path: "/pedersen", name: "Pedersen Hash" },
];

export default function Header(p: { subtitle: ReactNode; title: ReactNode }) {
  return (
    <header>
      <HeaderLayout subtitle={p.subtitle} title={p.title} links={links} />
    </header>
  );
}
