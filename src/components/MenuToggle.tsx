 
import React from "react";
import { motion } from "framer-motion";

type Props = { open: boolean } & React.SVGProps<SVGSVGElement>;

export default function MenuToggle({ open, ...rest }: Props) {
  return (
    <motion.svg
      width="22" height="22" viewBox="0 0 23 23" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      {...rest}
    >
      <motion.path
        variants={{ closed: { d: "M 2 5 L 20 5" }, open: { d: "M 4 4 L 18 18" } }}
        animate={open ? "open" : "closed"} transition={{ duration: 0.22 }}
      />
      <motion.path
        d="M 2 11 L 20 11"
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        animate={open ? "open" : "closed"} transition={{ duration: 0.12 }}
      />
      <motion.path
        variants={{ closed: { d: "M 2 17 L 20 17" }, open: { d: "M 4 18 L 18 4" } }}
        animate={open ? "open" : "closed"} transition={{ duration: 0.22 }}
      />
    </motion.svg>
  );
}
