import Image from "next/image";
import { forwardRef } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    error?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, onChange, error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <RPNInput.default
        ref={ref}
        className={cn(
          "flex rounded-xl border border-[#C3C3C3]",
          error ? "border-red-500" : "border-white",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountryComponent}
        inputComponent={InputComponent}
        defaultCountry="US"
        international={false}
        smartCaret={false}
        onChange={(value) => onChange?.(value as RPNInput.Value)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">Invalid number. Try again.</p>
      )}
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn(
        "rounded-e-xl rounded-s-none border-[#BDC7C9] py-[1.375rem] text-base focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
      ref={ref}
      placeholder={"+1 (___) ___-____"}
    />
  )
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountryComponent: React.FC<CountrySelectProps> = () => {
  return (
    <div className="flex w-[4.125rem] items-center justify-center gap-1 rounded-e-none rounded-s-xl border-[1px] border-black px-3">
      {/* <FlagComponent country={"US"} countryName={"United States"} /> */}
      <Image
        className=""
        src="/flag_us.svg"
        alt="Flag"
        width={34.29}
        height={20}
      />
    </div>
  );
};

const FlagComponent = ({ country }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  //   return <span>{Flag && <Flag title={countryName} />}US</span>;
  if (Flag) {
    return (
      <span className="flex h-full w-full bg-black bg-foreground/20 [&_svg]:size-full">
        {
          <Image
            className="object-none"
            src="/flag_us.svg"
            alt="Flag"
            width={34.29}
            height={20}
          />
        }
      </span>
    );
  }
  return <></>;
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
