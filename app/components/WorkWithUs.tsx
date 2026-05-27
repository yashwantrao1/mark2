import Image from "next/image";
import Link from "next/link";

export default function WorkWithUs() {
  return (
    <>
      <div className="my-44">
        <Link href="/contact" className="text-sm font-bold hover:underline w-fit">Contact Us</Link>
        <div>
          <Link href="/contact" className="group  block w-fit  py-12 px-10">
            <div className="w-80">
              <h4 className="text-[12vw] font-light leading-[1cap] text-right">Work</h4>
            </div>
            <div className="flex items-center gap-0">
              <div className="relative w-80 aspect-square shrink-0">
                <Image
                  src="/img/work_with_us.png"
                  alt="Work with us"
                  width={500}
                  height={500}
                  className="absolute inset-0 h-full w-full object-cover block group-hover:hidden grayscale-100"
                />
                <Image
                  src="/img/work_with_us_1.png"
                  alt="Work with us hover"
                  width={500}
                  height={500}
                  className="absolute inset-0 w-[calc(100% - 100px)] h-full object-cover hidden transition-opacity  group-hover:block grayscale-100"
                />
              </div>
              <div>
                <h2 className="text-[12vw] font-light leading-[1.2cap]">With</h2>
                <h2 className="text-[12vw] font-light leading-[1.2cap]">Us</h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
