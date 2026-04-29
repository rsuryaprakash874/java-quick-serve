import { Code2 } from "lucide-react";

const DeveloperWatermark = () => (
  <div className="w-full py-4 text-center border-t border-border/30 mt-8">
    <p className="text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1.5">
      <Code2 className="w-3 h-3" />
      Developed by <span className="font-semibold text-muted-foreground/80">Surya</span>,{" "}
      <span className="font-semibold text-muted-foreground/80">Allen</span> &{" "}
      <span className="font-semibold text-muted-foreground/80">Abhilash</span>
    </p>
  </div>
);

export default DeveloperWatermark;
