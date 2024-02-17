"use client";

import {
  InputGroup,
  Input,
  InputLeftAddon,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  ButtonGroup,
  useBoolean,
} from "@chakra-ui/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import "./search.styles.css";

export default function Search({ placeholder }: { placeholder: string }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const regionOptions = ["NA", "EUW", "EUNE", "OCE", "KR", "LAS"];
  const [inputValue, setInputValue] = useState(
    () => searchParams.get("username") || ""
  );
  const [region, setRegion] = useState(
    () => searchParams.get("region") || "NA"
  );
  const [isEditingRegion, setIsEditingRegion] = useState(false);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("username", term);
      params.set("region", region);
    } else {
      params.delete("username");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch(inputValue);
  };

  const handleRegionChange = (event: any) => {
    const params = new URLSearchParams(searchParams);
    setRegion(event.target.value);
    console.log(event, event.target.value);
    params.set("region", event.target.value);
    params.set("username", inputValue);
    setIsEditingRegion(false);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // useEffect to handle query parameter changes
  useEffect(() => {
    setInputValue(searchParams.get("username") || "");
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <InputGroup>
        <InputLeftAddon border="none">
          <Popover
            isOpen={isEditingRegion}
            onOpen={() => {
              setIsEditingRegion(true);
            }}
            onClose={() => {
              setIsEditingRegion(false);
            }}
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <Button>{region}</Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent width={100}>
                <PopoverArrow />
                <PopoverBody>
                  <div className="region-list">
                    {regionOptions.map((regionOption) => {
                      return (
                        <Button
                          key={regionOption}
                          width={65}
                          borderRadius="0px"
                          value={regionOption.toString()}
                          onClick={handleRegionChange}
                        >
                          {regionOption}
                        </Button>
                      );
                    })}
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </InputLeftAddon>
        <Input
          variant="filled"
          id="search"
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></Input>
      </InputGroup>
    </Suspense>
  );
}
