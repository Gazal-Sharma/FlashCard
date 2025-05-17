// src/components/Snowflakes.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Snowflake = ({ left, delay }) => (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: "100vh", opacity: 1 }}
    transition={{ duration: 10, delay, repeat: Infinity, ease: "linear" }}
    className="absolute text-4xl"
    style={{
      left: `${left}%`,
      top: "-50px",
      color: "#ffffff",
      pointerEvents: "none",
    }}
  >
    ❄️
  </motion.div>
);

const FallingSnowflakes = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {flakes.map((flake) => (
        <Snowflake key={flake.id} left={flake.left} delay={flake.delay} />
      ))}
    </div>
  );
};

export default FallingSnowflakes;