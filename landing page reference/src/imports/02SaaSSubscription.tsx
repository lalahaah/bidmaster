import clsx from "clsx";
import svgPaths from "./svg-uq8trdqt10";
import imgOval from "figma:asset/1f6c71fd617505cdff7fd61748409f73700c669c.png";
import imgOval1 from "figma:asset/802ecafe1dda57252963d45f673cb3d55f0c3eea.png";
import imgCalendar from "figma:asset/138051657bf53df48443c0703bb3a90227dbf2b9.png";
import imgCard2 from "figma:asset/432e87a5c675660bfd7cc9629d83888536e36131.png";
import imgEvent2 from "figma:asset/04b0d3dd936e971bd4a8a94a3d4be6972a03181d.png";
import imgSpecifyEventDetailsCard from "figma:asset/e2d07e3f3d782e72f929b01855dd229d67c5610c.png";
import imgUser2 from "figma:asset/0a42d2b92de55d717ff728378cbbfd79a487b068.png";
import imgUser3 from "figma:asset/746a10a8d1bffefcdc61f932a4279f23a232a067.png";
import imgUser1 from "figma:asset/0a513264e2f20485e5c1b578cc1f1588a48709ef.png";
import imgBrowser2 from "figma:asset/1f5d5a5df941b09713d1ea8f606c1498f4489802.png";
import { imgBrowser01 } from "./svg-xoey0";
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        {children}
      </svg>
    </div>
  );
}

function Helper2() {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 43 43" className="absolute block size-full">
      <circle cx="21.5" cy="21.5" fill="var(--fill-0, #473BF0)" id="Oval" opacity="0.100028" r="21.5" />
    </svg>
  );
}
type SmallRightProps = {
  additionalClassNames?: string;
};

function SmallRight({ additionalClassNames = "" }: SmallRightProps) {
  return (
    <div className={clsx("absolute", additionalClassNames)}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
        <g id="small-right">
          <circle cx="14.5" cy="14.5" fill="var(--fill-0, #68D585)" id="Oval" r="14.5" />
          <g id="alert-que">
            <path d={svgPaths.p24e07880} fill="var(--fill-0, white)" id="Path" />
            <circle cx="14" cy="20" fill="var(--fill-0, white)" id="Oval_2" r="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Rectangle() {
  return (
    <div className="absolute bg-white inset-0 rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#e7e9ed] border-solid inset-[-0.5px] pointer-events-none rounded-[10.5px]" />
    </div>
  );
}
type TagTextProps = {
  text: string;
};

function TagText({ text }: TagTextProps) {
  return (
    <div className="absolute inset-0 overflow-clip">
      <div className="absolute bg-[#473bf0] inset-0 opacity-10 rounded-[14.5px]" data-name="Rectangle" />
      <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[normal] left-[13.68%] not-italic right-[12.63%] text-[#473bf0] text-[13px] text-center top-[calc(50%-8.5px)] tracking-[1.625px] uppercase whitespace-nowrap">{text}</p>
    </div>
  );
}
type ButtonText1Props = {
  text: string;
};

function ButtonText1({ text }: ButtonText1Props) {
  return (
    <div className="absolute inset-0 overflow-clip">
      <div className="absolute bg-[#473bf0] inset-0 rounded-[8px]" data-name="Rectangle" />
      <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic right-0 text-[17px] text-center text-white top-[calc(50%-16.5px)] tracking-[-0.6px]">{text}</p>
    </div>
  );
}
type ButtonTextProps = {
  text: string;
};

function ButtonText({ text }: ButtonTextProps) {
  return (
    <div className="absolute inset-0 overflow-clip">
      <div className="absolute bg-[#473bf0] inset-0 rounded-[8px]" data-name="Rectangle" />
      <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[21px] not-italic text-[17px] text-white top-[calc(50%-16.5px)] tracking-[-0.6px] whitespace-nowrap">{text}</p>
      <div className="-translate-y-1/2 absolute contents right-[20px] top-[calc(50%+0.13px)]">
        <div className="-translate-y-1/2 absolute h-[11.267px] right-[20px] top-[calc(50%+0.13px)] w-[6.067px]" data-name="Path">
          <div className="absolute inset-[-12.54%_-11.22%_-12.54%_-23.3%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16036 14.0932">
              <path d={svgPaths.p20caf500} id="Path" stroke="var(--stroke-0, white)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute h-[1.733px] right-[20.87px] top-[calc(50%-0.3px)] w-[12.133px]" data-name="Path">
          <div className="absolute inset-[3.91%_-8.24%_-19.3%_-8.24%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1333 2">
              <path d="M1 1H13.1333" id="Path" stroke="var(--stroke-0, white)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Helper1() {
  return (
    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 1601 1" className="absolute block size-full">
      <path d="M0.5 0.5H1600.5" id="Line" stroke="var(--stroke-0, #E7E9ED)" strokeLinecap="square" />
    </svg>
  );
}
type HelperProps = {
  text: string;
  text1: string;
  text2: string;
  text3: string;
};

function Helper({ text, text1, text2, text3 }: HelperProps) {
  return (
    <div className="absolute inset-[22.33%_0_0_0] leading-[40px] text-[17px] tracking-[-0.2px]">
      <p className="mb-0">{text}</p>
      <p className="mb-0">{text1}</p>
      <p className="mb-0">{text2}</p>
      <p>{text3}</p>
    </div>
  );
}

export default function Component02SaaSSubscription() {
  return (
    <div className="bg-[#fcfdfe] relative size-full" data-name="02-SaaS Subscription">
      <div className="absolute h-[367px] left-0 top-[5558px] w-[1601px]" data-name="Footer">
        <div className="absolute contents inset-[0.14%_0_0_0]" data-name="Footer">
          <div className="absolute font-['Gilroy:Regular',sans-serif] inset-[32.97%_52.28%_10.9%_38.73%] not-italic overflow-clip text-[#161c2d]" data-name="1">
            <p className="absolute leading-[26px] left-0 opacity-70 right-[52.78%] text-[15px] top-[calc(50%-103px)] tracking-[-0.1px] whitespace-nowrap">Company</p>
            <Helper text="About us" text1="Contact us" text2="Careers" text3="Press" />
          </div>
          <div className="absolute font-['Gilroy:Regular',sans-serif] inset-[32.97%_41.54%_0_50.66%] not-italic overflow-clip text-[#161c2d]" data-name="2">
            <p className="absolute leading-[26px] left-0 opacity-70 right-[56.8%] text-[15px] top-[calc(50%-123px)] tracking-[-0.1px] whitespace-nowrap">Product</p>
            <div className="absolute inset-[18.7%_0_0_0] leading-[40px] text-[17px] tracking-[-0.2px]">
              <p className="mb-0">Features</p>
              <p className="mb-0">Pricing</p>
              <p className="mb-0">News</p>
              <p className="mb-0">Help desk</p>
              <p>Support</p>
            </div>
          </div>
          <div className="absolute font-['Gilroy:Regular',sans-serif] inset-[32.97%_28.54%_10.9%_61.71%] not-italic overflow-clip text-[#161c2d]" data-name="3">
            <p className="absolute leading-[26px] left-0 opacity-70 right-[64.1%] text-[15px] top-[calc(50%-103px)] tracking-[-0.1px] whitespace-nowrap">Services</p>
            <Helper text="Digital Marketing" text1="Content Writing" text2="SEO for Business" text3="UI Design" />
          </div>
          <div className="absolute font-['Gilroy:Regular',sans-serif] inset-[32.97%_15.37%_21.8%_74.58%] not-italic overflow-clip text-[#161c2d]" data-name="4">
            <p className="absolute leading-[26px] left-0 opacity-70 right-[76.4%] text-[15px] top-[calc(50%-83px)] tracking-[-0.1px] whitespace-nowrap">Legal</p>
            <div className="absolute inset-[27.71%_0_0_0] leading-[40px] text-[17px] tracking-[-0.2px]">
              <p className="mb-0">Privacy Policy</p>
              <p className="mb-0">{`Terms & Conditions`}</p>
              <p>Return Policy</p>
            </div>
          </div>
          <div className="absolute inset-[32.97%_68.39%_11.17%_15.3%] overflow-clip" data-name="0">
            <div className="absolute contents inset-[90.73%_45.59%_0_0]" data-name="Social">
              <div className="absolute inset-[92.2%_93.49%_0.49%_0]" data-name="logo-twitter">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
                  <g id="logo-twitter">
                    <path d={svgPaths.pdae8880} fill="var(--fill-0, #161C2D)" id="Path" />
                  </g>
                </svg>
              </div>
              <div className="absolute inset-[90.73%_77.39%_0_15.33%]" data-name="logo-facebook">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
                  <g id="logo-facebook">
                    <path d={svgPaths.p1914f400} fill="var(--fill-0, #473BF0)" id="Path" />
                  </g>
                </svg>
              </div>
              <Wrapper additionalClassNames="inset-[91.22%_61.69%_0_31.42%]">
                <g id="logo-instagram">
                  <path clipRule="evenodd" d={svgPaths.p32ba1c00} fill="var(--fill-0, #161C2D)" fillRule="evenodd" id="Shape" />
                  <path clipRule="evenodd" d={svgPaths.p2c28b940} fill="var(--fill-0, #161C2D)" fillRule="evenodd" id="Shape_2" />
                  <circle cx="13.5" cy="4.5" fill="var(--fill-0, #161C2D)" id="Oval" r="1.22727" />
                </g>
              </Wrapper>
              <Wrapper additionalClassNames="inset-[91.22%_45.59%_0_47.51%]">
                <g id="logo-linkedin">
                  <path clipRule="evenodd" d={svgPaths.p11450b00} fill="var(--fill-0, #161C2D)" fillRule="evenodd" id="Shape" />
                </g>
              </Wrapper>
            </div>
            <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[33.66%_0_28.29%_0] leading-[26px] not-italic opacity-70 text-[#161c2d] text-[15px] tracking-[-0.1px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
            <p className="absolute font-['Rubik:Bold',sans-serif] font-bold leading-[normal] left-0 right-[49.81%] text-[#161c2d] text-[28px] top-[calc(50%-102.5px)] tracking-[-0.1556px] whitespace-nowrap">Brainwave.io</p>
          </div>
          <div className="absolute inset-[0.14%_0_99.59%_0]" data-name="Line">
            <Helper1 />
          </div>
        </div>
      </div>
      <div className="absolute contents left-[245px] top-[5339px]" data-name="CTA">
        <div className="absolute h-[128px] left-[245px] not-italic overflow-clip text-[#161c2d] top-[5339px] w-[503px]" data-name="Title">
          <p className="absolute bottom-0 font-['Gilroy:Regular',sans-serif] leading-[32px] left-0 opacity-70 right-0 text-[19px] top-1/2 tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[44px] left-0 right-[3.18%] text-[32px] top-[calc(50%-64px)] tracking-[-1.2px]">Build better landing page fast</p>
        </div>
        <div className="absolute h-[59px] left-[1182px] top-[5374px] w-[173px]" data-name="Button / Solid / Style 01">
          <ButtonText text="Get it now" />
        </div>
        <div className="absolute h-[59px] left-[980px] top-[5374px] w-[182px]" data-name="Button / Solid / Style 03">
          <div className="absolute inset-0 overflow-clip" data-name="Button 1">
            <div className="absolute bg-[#473bf0] inset-0 opacity-8 rounded-[8px]" data-name="Rectangle" />
            <div className="-translate-y-1/2 absolute h-[32px] left-[10.82%] overflow-clip right-[37.63%] top-[calc(50%-0.5px)]" data-name="Button name">
              <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#473bf0] text-[17px] top-[calc(50%-16px)] tracking-[-0.6px] whitespace-nowrap">Learn more</p>
            </div>
            <div className="-translate-y-1/2 absolute contents right-[20px] top-[calc(50%-0.43px)]" data-name="tail-right">
              <div className="-translate-y-1/2 absolute h-[12.133px] right-[20px] top-[calc(50%-0.43px)] w-[6.533px]" data-name="Path">
                <div className="absolute inset-[-11.65%_-10.42%_-11.65%_-21.63%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.62703 14.9598">
                    <path d={svgPaths.pb41dc20} id="Path" stroke="var(--stroke-0, #473BF0)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="-translate-y-1/2 absolute h-[1.867px] right-[20.93px] top-[calc(50%-0.9px)] w-[13.067px]" data-name="Path">
                <div className="absolute inset-[8.04%_-7.65%_-15.18%_-7.65%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0667 2">
                    <path d="M1 1H14.0667" id="Path" stroke="var(--stroke-0, #473BF0)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents left-0 top-[3585px]" data-name="Pricing">
        <div className="absolute bg-[#161c2d] h-[1524px] left-0 top-[3733px] w-[1600px]" data-name="Rectangle" />
        <div className="absolute h-[63px] left-0 top-[3585px] w-[1600px]" data-name="Path 3">
          <div className="absolute inset-[0_0_7.24%_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1600 58.4362">
              <path clipRule="evenodd" d={svgPaths.p23180f0} fill="var(--fill-0, #F4F7FA)" fillRule="evenodd" id="Path 3" />
            </svg>
          </div>
        </div>
        <div className="absolute h-[441px] left-[245px] overflow-clip top-[4018px] w-[350px]" data-name="1">
          <Rectangle />
          <div className="absolute inset-[83.22%_4%_3.4%_5.14%]" data-name="Button/Solid/Style 04">
            <ButtonText1 text="Get started for free" />
          </div>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[29.43%] not-italic opacity-70 right-[29.14%] text-[#161c2d] text-[17px] text-center top-[calc(50%-66.5px)] tracking-[-0.2px] whitespace-nowrap">One time purchase</p>
          <div className="absolute inset-[7.71%_38.29%_85.71%_38.29%]" data-name="Tag/Tag 02">
            <TagText text="Basic" />
          </div>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-[39.43%] not-italic right-[39.14%] text-[#161c2d] text-[48px] text-center top-[calc(50%-129.5px)] tracking-[-1.8px] whitespace-nowrap">$29</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[7.71%] not-italic right-[7.71%] text-[#161c2d] text-[17px] text-center top-[calc(50%+2.5px)] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
        </div>
        <div className="absolute h-[441px] left-[625px] overflow-clip top-[4018px] w-[350px]" data-name="1 copy 3">
          <Rectangle />
          <div className="absolute inset-[83.22%_4%_3.4%_5.14%]" data-name="Button/Solid/Style 04">
            <ButtonText1 text="Get started for free" />
          </div>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[29.43%] not-italic opacity-70 right-[29.14%] text-[#161c2d] text-[17px] text-center top-[calc(50%-66.5px)] tracking-[-0.2px] whitespace-nowrap">One time purchase</p>
          <div className="absolute inset-[7.71%_35.14%_85.71%_36.29%]" data-name="Tag/Tag 02">
            <TagText text="Standard" />
          </div>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-[39.14%] not-italic right-[38.86%] text-[#161c2d] text-[48px] text-center top-[calc(50%-129.5px)] tracking-[-1.8px] whitespace-nowrap">$49</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[7.71%] not-italic right-[7.71%] text-[#161c2d] text-[17px] text-center top-[calc(50%+2.5px)] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
        </div>
        <div className="absolute h-[441px] left-[1005px] overflow-clip top-[4018px] w-[350px]" data-name="1 copy 5">
          <Rectangle />
          <div className="absolute inset-[83.22%_4%_3.4%_5.14%]" data-name="Button/Solid/Style 04">
            <ButtonText1 text="Get started for free" />
          </div>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[29.43%] not-italic opacity-70 right-[29.14%] text-[#161c2d] text-[17px] text-center top-[calc(50%-66.5px)] tracking-[-0.2px] whitespace-nowrap">One time purchase</p>
          <div className="absolute inset-[7.71%_37.14%_85.71%_37.14%]" data-name="Tag/Tag 02">
            <TagText text="Premium" />
          </div>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-[39.14%] not-italic right-[39.14%] text-[#161c2d] text-[48px] text-center top-[calc(50%-129.5px)] tracking-[-1.8px] whitespace-nowrap">$99</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[29px] left-[7.71%] not-italic right-[7.71%] text-[#161c2d] text-[17px] text-center top-[calc(50%+2.5px)] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
        </div>
        <div className="absolute h-[129px] left-[416px] not-italic overflow-clip text-center text-white top-[3825px] w-[769px]" data-name="Title">
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[50.39%_11.7%_0_11.7%] leading-[32px] opacity-65 text-[19px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[48px] left-0 right-0 text-[36px] top-[calc(50%-64.5px)] tracking-[-1.2px]">{`Pricing & Plans`}</p>
        </div>
      </div>
      <div className="absolute h-[564px] left-[245px] overflow-clip top-[4566px] w-[1077px]" data-name="FAQ">
        <div className="absolute inset-[0_52.92%_59.93%_0] overflow-clip" data-name="1">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[9.47%] not-italic right-[33.93%] text-[21px] text-white top-[calc(50%-113px)] tracking-[-0.5px] whitespace-nowrap">Can I use Albino for my clients?</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[23.01%_0_25.66%_9.47%] leading-[29px] not-italic opacity-65 text-[17px] text-white tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page. Integer ut Oberyn massa. Sed feugiat vitae turpis a porta. Aliquam sagittis interdum Melisandre.</p>
          <div className="absolute inset-[85.84%_57.79%_0_9.27%]" data-name="Button / Flat / Style 02">
            <div className="absolute inset-[0_0.81%_0_0] overflow-clip" data-name="Button 1">
              <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#68d585] text-[17px] top-[calc(50%-16px)] tracking-[-0.6px] whitespace-nowrap">Click to learn more</p>
              <div className="-translate-y-1/2 absolute contents right-0 top-[calc(50%+0.33px)]" data-name="tail-right">
                <div className="-translate-y-1/2 absolute h-[8.667px] right-0 top-[calc(50%+0.33px)] w-[4.667px]" data-name="Path">
                  <div className="absolute inset-[-16.31%_-14.58%_-16.31%_-30.28%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.76036 11.4932">
                      <path d={svgPaths.p3edd9700} id="Path" stroke="var(--stroke-0, #68D585)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <div className="-translate-y-1/2 absolute h-[1.333px] right-[0.67px] top-1/2 w-[9.333px]" data-name="Path">
                  <div className="absolute inset-[-13.39%_-10.71%_-36.61%_-10.71%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3333 2">
                      <path d="M1 1H10.3333" id="Path" stroke="var(--stroke-0, #68D585)" strokeLinecap="square" strokeLinejoin="bevel" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SmallRight additionalClassNames="inset-[3.1%_94.28%_84.07%_0]" />
        </div>
        <div className="absolute inset-[0_0_70.21%_52.92%] overflow-clip" data-name="2">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[9.47%] not-italic right-[37.08%] text-[21px] text-white top-[calc(50%-84px)] tracking-[-0.5px] whitespace-nowrap">Does it work with WordPress?</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[30.95%_0_0_9.47%] leading-[29px] not-italic opacity-65 text-[17px] text-white tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page. Integer ut Oberyn massa. Sed feugiat vitae turpis a porta. Aliquam sagittis interdum Melisandre.</p>
          <SmallRight additionalClassNames="inset-[4.17%_94.28%_78.57%_0]" />
        </div>
        <div className="absolute inset-[50.53%_52.92%_19.68%_0] overflow-clip" data-name="1 copy 4">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[9.47%] not-italic right-[49.7%] text-[21px] text-white top-[calc(50%-84px)] tracking-[-0.5px] whitespace-nowrap">Do I get free updates?</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[30.95%_0_0_9.47%] leading-[29px] not-italic opacity-65 text-[17px] text-white tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page. Integer ut Oberyn massa. Sed feugiat vitae turpis a porta. Aliquam sagittis interdum Melisandre.</p>
          <SmallRight additionalClassNames="inset-[4.17%_94.28%_78.57%_0]" />
        </div>
        <div className="absolute inset-[50.53%_0_19.68%_52.92%] overflow-clip" data-name="2 copy">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[9.47%] not-italic right-[43.59%] text-[21px] text-white top-[calc(50%-84px)] tracking-[-0.5px] whitespace-nowrap">Will you provide support?</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[30.95%_0_0_9.47%] leading-[29px] not-italic opacity-65 text-[17px] text-white tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page. Integer ut Oberyn massa. Sed feugiat vitae turpis a porta. Aliquam sagittis interdum Melisandre.</p>
          <SmallRight additionalClassNames="inset-[4.17%_94.28%_78.57%_0]" />
        </div>
        <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[0] left-[33.43%] not-italic right-[30.36%] text-[17px] text-center text-white top-[calc(50%+253px)] tracking-[-0.2px] whitespace-nowrap">
          <span className="leading-[29px]">{`Haven’t got your answer? `}</span>
          <span className="leading-[29px] text-[#68d585]">Contact our support now</span>
        </p>
      </div>
      <div className="absolute contents left-0 top-[3213px]" data-name="Testimonial">
        <div className="absolute bg-[#f4f7fa] h-[520px] left-0 top-[3213px] w-[1600px]" data-name="Rectangle" />
        <div className="absolute h-[315px] left-[245px] overflow-clip top-[3325px] w-[540px]" data-name="1">
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[55.56%_17.04%_24.13%_17.04%] leading-[32px] not-italic opacity-70 text-[#161c2d] text-[19px] text-center tracking-[-0.2px]">My new site is so much faster and easier to work with than my old site.</p>
          <div className="absolute inset-[0_43.33%_77.14%_43.33%]" data-name="Oval">
            <img alt="" className="absolute block max-w-none size-full" height="72" src={imgOval} width="72" />
          </div>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[26px] left-[39.54%] not-italic opacity-70 right-[39.35%] text-[#161c2d] text-[15px] text-center top-[calc(50%+131.5px)] tracking-[-0.1px] whitespace-nowrap">Founder at Zenix</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[29px] left-[40.74%] not-italic right-[40.37%] text-[#161c2d] text-[17px] text-center top-[calc(50%+104.5px)] tracking-[-0.2px] whitespace-nowrap">Corey Valdez</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] inset-[37.14%_0_52.06%_0] leading-[34px] not-italic text-[#161c2d] text-[24px] text-center tracking-[-0.5px]">“You made it so simple”</p>
        </div>
        <div className="absolute h-[315px] left-[815px] overflow-clip top-[3325px] w-[540px]" data-name="2">
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[55.56%_17.04%_24.13%_17.04%] leading-[32px] not-italic opacity-70 text-[#161c2d] text-[19px] text-center tracking-[-0.2px]">Better than all the rest. I’d recommend this product to beginners.</p>
          <div className="absolute inset-[0_43.33%_77.14%_43.33%]" data-name="Oval">
            <img alt="" className="absolute block max-w-none size-full" height="72" src={imgOval1} width="72" />
          </div>
          <p className="absolute font-['Gilroy:Regular',sans-serif] leading-[26px] left-[40.19%] not-italic opacity-70 right-[40%] text-[#161c2d] text-[15px] text-center top-[calc(50%+131.5px)] tracking-[-0.1px] whitespace-nowrap">Digital Marketer</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[29px] left-[44.07%] not-italic right-[43.52%] text-[#161c2d] text-[17px] text-center top-[calc(50%+104.5px)] tracking-[-0.2px] whitespace-nowrap">Ian Klein</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] inset-[37.14%_0_52.06%_0] leading-[34px] not-italic text-[#161c2d] text-[24px] text-center tracking-[-0.5px]">“Simply the best”</p>
        </div>
        <div className="absolute h-[170px] left-[801px] top-[3395.5px] w-px">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 170">
            <path d="M0.5 0.5V169.5" id="Line 4" stroke="var(--stroke-0, #E7E9ED)" strokeLinecap="square" />
          </svg>
        </div>
      </div>
      <div className="absolute contents left-[295px] top-[2509px]" data-name="Content 02">
        <div className="absolute contents left-[880px] top-[2742px]" data-name="Content Right">
          <div className="absolute h-[100px] left-[880px] overflow-clip top-[2742px] w-[404px]" data-name="1">
            <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[42%_0_0_16.09%] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">{`With lots of unique blocks, you can easily build a page without coding. `}</p>
            <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[16.09%] not-italic right-[46.04%] text-[#161c2d] text-[21px] top-[calc(50%-50px)] tracking-[-0.5px] whitespace-nowrap">Create a project</p>
            <div className="absolute inset-[6%_89.36%_51%_0] overflow-clip">
              <Helper2 />
              <p className="absolute font-['Rubik:Regular',sans-serif] font-normal leading-[32px] left-[41.86%] right-[39.53%] text-[#473bf0] text-[17px] top-[calc(50%-15.5px)] tracking-[-0.0944px] whitespace-nowrap">1</p>
            </div>
          </div>
          <div className="absolute h-[100px] left-[880px] overflow-clip top-[2872px] w-[404px]" data-name="1 copy">
            <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[42%_0_0_16.09%] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">{`With lots of unique blocks, you can easily build a page without coding. `}</p>
            <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[16.09%] not-italic right-[33.66%] text-[#161c2d] text-[21px] top-[calc(50%-50px)] tracking-[-0.5px] whitespace-nowrap">Assign related people</p>
            <div className="absolute inset-[6%_89.36%_51%_0] overflow-clip">
              <Helper2 />
              <p className="absolute font-['Rubik:Regular',sans-serif] font-normal leading-[32px] left-[39.53%] right-[37.21%] text-[#473bf0] text-[17px] text-center top-[calc(50%-15.5px)] tracking-[-0.0944px] whitespace-nowrap">2</p>
            </div>
          </div>
          <div className="absolute h-[100px] left-[880px] overflow-clip top-[3002px] w-[404px]" data-name="1 copy 2">
            <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[42%_0_0_16.09%] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">{`With lots of unique blocks, you can easily build a page without coding. `}</p>
            <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-[16.09%] not-italic right-[34.16%] text-[#161c2d] text-[21px] top-[calc(50%-50px)] tracking-[-0.5px] whitespace-nowrap">Make it done on-time</p>
            <div className="absolute inset-[6%_89.36%_51%_0] overflow-clip">
              <Helper2 />
              <p className="absolute font-['Rubik:Regular',sans-serif] font-normal leading-[32px] left-[38.37%] right-[36.05%] text-[#473bf0] text-[17px] text-center top-[calc(50%-15.5px)] tracking-[-0.0944px] whitespace-nowrap">3</p>
            </div>
          </div>
        </div>
        <div className="absolute contents left-[295px] top-[2721px]" data-name="Image">
          <div className="absolute h-[264px] left-[572px] opacity-50 top-[2758px] w-[209px]" data-name="calendar">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCalendar} />
            </div>
          </div>
          <div className="absolute h-[381px] left-[295px] opacity-86 top-[2721px] w-[263px]" data-name="card 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCard2} />
            </div>
          </div>
          <div className="absolute h-[166px] left-[371px] shadow-[0px_23px_54px_0px_rgba(29,23,122,0.24)] top-[2829px] w-[333px]" data-name="event 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgEvent2} />
            </div>
          </div>
        </div>
        <div className="absolute h-[129px] left-[428px] not-italic overflow-clip text-[#161c2d] text-center top-[2509px] w-[769px]" data-name="Title">
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[50.39%_11.7%_0_11.7%] leading-[32px] opacity-70 text-[19px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[48px] left-0 right-0 text-[36px] top-[calc(50%-64.5px)] tracking-[-1.2px]">Manage your projects fast</p>
        </div>
      </div>
      <div className="absolute contents left-0 top-[2297px]" data-name="Facts">
        <div className="absolute h-[58px] left-[288px] not-italic overflow-clip text-[#161c2d] top-[2297px] w-[285px]" data-name="1">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-0 right-[71.58%] text-[48px] top-[calc(50%-29px)] tracking-[-1.8px] whitespace-nowrap">1M+</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[0_0_0_38.95%] leading-[29px] opacity-70 text-[17px] tracking-[-0.2px]">Customers visit Albino every months</p>
        </div>
        <div className="absolute h-[58px] left-[668px] not-italic overflow-clip text-[#161c2d] top-[2297px] w-[290px]" data-name="1 copy 6">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-0 right-[71.38%] text-[48px] top-[calc(50%-29px)] tracking-[-1.8px] whitespace-nowrap">93%</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[0_0_0_40%] leading-[29px] opacity-70 text-[17px] tracking-[-0.2px]">Satisfaction rate from our customers.</p>
        </div>
        <div className="absolute h-[58px] left-[1048px] not-italic overflow-clip text-[#161c2d] top-[2297px] w-[264px]" data-name="1 copy 7">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-0 right-[76.89%] text-[48px] top-[calc(50%-29px)] tracking-[-1.8px] whitespace-nowrap">4.9</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[0_0_0_34.09%] leading-[29px] opacity-70 text-[17px] tracking-[-0.2px]">Average customer ratings out of 5.00!</p>
        </div>
        <div className="absolute h-px left-0 top-[2430px] w-[1601px]">
          <Helper1 />
        </div>
      </div>
      <div className="absolute contents left-0 top-[1525px]" data-name="Content 01">
        <div className="absolute bg-[#f4f7fa] h-[691px] left-0 top-[1525px] w-[1600px]" data-name="BG" />
        <div className="absolute h-[320px] left-[245px] overflow-clip top-[1707px] w-[414px]" data-name="Content left">
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[38.44%_0.48%_31.56%_0] leading-[32px] not-italic opacity-70 text-[#161c2d] text-[19px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page so quickly with Albino.</p>
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[48px] left-[0.48%] not-italic right-0 text-[#161c2d] text-[36px] top-[calc(50%-160px)] tracking-[-1.2px]">Getting started with Albino is easier than ever</p>
          <div className="absolute inset-[81.41%_41.55%_0.16%_0.24%]" data-name="Button / Solid / Style 01">
            <ButtonText text="Get started for free" />
          </div>
        </div>
        <div className="absolute contents left-[841px] top-[1623px]" data-name="Image">
          <div className="absolute h-[469px] left-[841px] opacity-42 top-[1641px] w-[282px]" data-name="specify event details card">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSpecifyEventDetailsCard} />
            </div>
          </div>
          <div className="absolute left-[1153px] opacity-65 size-[202px] top-[1862px]" data-name="user 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUser2} />
            </div>
          </div>
          <div className="absolute left-[1172px] opacity-16 size-[164px] top-[1623px]" data-name="user 3">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUser3} />
            </div>
          </div>
          <div className="absolute h-[289px] left-[966px] shadow-[0px_32px_54px_0px_rgba(15,14,35,0.19)] top-[1717px] w-[288px]" data-name="user 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUser1} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[245px] top-[1223px]" data-name="Features">
        <div className="absolute h-[210px] left-[245px] overflow-clip top-[1223px] w-[289px]" data-name="Group">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic right-[31.49%] text-[#161c2d] text-[21px] top-[calc(50%-34px)] tracking-[-0.5px] whitespace-nowrap">Project management</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[58.57%_0_0_0] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <div className="absolute inset-[0.27%_84.77%_82.18%_0]" data-name="code">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43.9995 36.8499">
              <g id="code">
                <path clipRule="evenodd" d={svgPaths.p1dd6f180} fill="var(--fill-0, #68D585)" fillRule="evenodd" id="Path" />
                <path clipRule="evenodd" d={svgPaths.p2306cb80} fill="var(--fill-0, #68D585)" fillRule="evenodd" id="Path_2" />
                <rect fill="var(--fill-0, #D5D7DD)" height="3.99999" id="Rectangle" transform="rotate(-75.954 15.5716 35.8791)" width="36.985" x="15.5716" y="35.8791" />
              </g>
            </svg>
          </div>
        </div>
        <div className="absolute h-[209px] left-[625px] overflow-clip top-[1224px] w-[295px]" data-name="Group Copy">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic right-[56.95%] text-[#161c2d] text-[21px] top-[calc(50%-34.5px)] tracking-[-0.5px] whitespace-nowrap">Time tracking</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[58.37%_0_0_0] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <div className="absolute inset-[0_87.12%_82.3%_0.34%]" data-name="countdown-2">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 37">
              <g id="countdown-2">
                <path d={svgPaths.p230f6d80} fill="var(--fill-0, #D5D7DD)" id="Path" />
                <path d={svgPaths.p3796a080} fill="var(--fill-0, #68D585)" id="Path_2" />
              </g>
            </svg>
          </div>
        </div>
        <div className="absolute h-[210px] left-[1005px] overflow-clip top-[1223px] w-[294px]" data-name="Group Copy 2">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic right-[33.67%] text-[#161c2d] text-[21px] top-[calc(50%-34px)] tracking-[-0.5px] whitespace-nowrap">Beautiful mobile app</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[58.57%_0_0_0] leading-[29px] not-italic opacity-70 text-[#161c2d] text-[17px] tracking-[-0.2px]">With lots of unique blocks, you can easily build a page without coding. Build your next landing page.</p>
          <div className="absolute inset-[0_90.82%_81.9%_0.34%]" data-name="smartphone">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 38">
              <g id="smartphone">
                <path clipRule="evenodd" d={svgPaths.p266c2e00} fill="var(--fill-0, #68D585)" fillRule="evenodd" id="Shape" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[378px] top-[145px]" data-name="Hero">
        <div className="absolute h-[301px] left-[491px] overflow-clip top-[145px] w-[619px]" data-name="Content">
          <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[58px] left-0 not-italic right-0 text-[#161c2d] text-[48px] text-center top-[calc(50%-150.5px)] tracking-[-1.8px]">Get things done by awesome remote team</p>
          <p className="absolute font-['Gilroy:Regular',sans-serif] inset-[45.18%_5.33%_33.55%_5.33%] leading-[32px] not-italic opacity-70 text-[#161c2d] text-[19px] text-center tracking-[-0.2px]">We share common trends and strategies for improving your rental income and making sure you stay in high demand.</p>
          <div className="absolute contents inset-[80.4%_16.8%_0_15.83%]" data-name="Buttons">
            <div className="absolute inset-[80.4%_16.8%_0_55.74%]" data-name="Button / Solid / Style 02">
              <div className="absolute inset-0 overflow-clip" data-name="Button 1 Copy">
                <div className="absolute inset-0 rounded-[8px]" data-name="Rectangle" />
                <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[32px] left-0 not-italic right-0 text-[#161c2d] text-[17px] text-center top-[calc(50%-15.5px)] tracking-[-0.6px]">Learn more</p>
              </div>
            </div>
            <div className="absolute inset-[80.4%_47.5%_0_15.83%]" data-name="Button / Solid / Style 01">
              <ButtonText text="Get started for free" />
            </div>
          </div>
        </div>
        <div className="absolute contents left-[378px] top-[552px]" data-name="Image">
          <div className="absolute bg-[#94a2b6] h-[559px] left-[378px] rounded-[10px] shadow-[0px_42px_44px_-10px_rgba(1,23,48,0.12)] top-[552px] w-[844px]" data-name="IMG" />
          <div className="absolute h-[562px] left-[377px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-33px_2px] mask-size-[912px_635px] top-[550px] w-[848px]" data-name="browser 01" style={{ maskImage: `url('${imgBrowser01}')` }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBrowser2} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[46px] left-[43px] overflow-clip top-[24px] w-[1519px]" data-name="Header">
        <p className="absolute font-['Rubik:Bold',sans-serif] font-bold leading-[normal] left-0 right-[89.86%] text-[#161c2d] text-[24px] top-[calc(50%-23px)] tracking-[-0.1333px] whitespace-nowrap">Brainwave.io</p>
        <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[26px] left-[38.91%] not-italic right-[39.17%] text-[#161c2d] text-[15px] text-center top-[calc(50%-12px)] tracking-[-0.1px] whitespace-pre">{`Demos            Pages            Support            Contact`}</p>
        <div className="absolute inset-[1.09%_0_1.09%_89.6%]" data-name="Button/Solid/Style 06">
          <div className="absolute inset-0 overflow-clip" data-name="Button 1">
            <div className="absolute bg-[#473bf0] inset-0 rounded-[8px]" data-name="BG" />
            <p className="absolute font-['Gilroy:Bold',sans-serif] leading-[normal] left-0 not-italic right-0 text-[17px] text-center text-white top-[calc(50%-11.5px)] tracking-[-0.5px]">Get started free</p>
          </div>
        </div>
      </div>
    </div>
  );
}