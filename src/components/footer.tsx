import { useAppContext } from "@/store/app.store";
import { CircleHelp } from "lucide-react";
function Footer() {
  const { setSlideOpen } = useAppContext();
  const openSlideshow = () => {
    setSlideOpen(true);
    // Optional: prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };
  return (
    <footer
      className={`w-full flex justify-center items-center bg-transparent p-1 h-[2vh]`}
    >
      <button
        className={`text-white underline hover:cursor-pointer flex justify-center items-center space-x-1`}
        onClick={openSlideshow}
      >
        <span>not sure what this is</span>
        <CircleHelp className="w-4 h-4" />
      </button>
    </footer>
  );
}

export default Footer;
