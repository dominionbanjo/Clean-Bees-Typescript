import { motion } from "framer-motion";
import { ReactNode } from "react";

const animations = {
  initial: {
    opacity: 0,
    x: -100,
    position: "absolute" as const,
    width: "100%",
    zIndex: 10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

interface AnimatedPageProps {
  children: ReactNode;
  key?: string;
}

const AnimatedPage = ({ children, key }: AnimatedPageProps) => {
  return (
    <motion.div
      key={key}
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        top: 0,
        zIndex: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
