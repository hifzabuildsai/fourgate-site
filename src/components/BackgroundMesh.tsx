export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full blur-[90px] opacity-[0.14] bg-gold animate-drift-a"
        style={{ width: 520, height: 520, top: -180, left: -120 }}
      />
      <div
        className="absolute rounded-full blur-[90px] opacity-[0.14] bg-[#3a6ea5] animate-drift-b"
        style={{ width: 420, height: 420, top: 280, right: -160 }}
      />
      <div
        className="absolute rounded-full blur-[90px] opacity-[0.14] bg-gold-dim animate-drift-a-rev"
        style={{ width: 380, height: 380, bottom: -140, left: "30%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}
