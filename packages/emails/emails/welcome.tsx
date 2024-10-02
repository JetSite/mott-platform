import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "../tailwind";

const baseUrl = "https://app.mott.ai";

export const WelcomeEmail = ({ username = "username" }: any) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to mott.ai</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Welcome to <strong>mott.ai</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We're excited to have you on board! Your account has been
              successfully created at <strong>mott.ai</strong>.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`${baseUrl}`}
              >
                Get Started
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              If the button above doesn't work, copy and paste this URL into
              your browser:{" "}
              <Link href={`${baseUrl}`} className="text-blue-600 no-underline">
                {`${baseUrl}`}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was sent to{" "}
              <span className="text-black">{username}</span>. If you did not
              create an account on mott.ai, please ignore this email or contact
              our support team if you have any concerns.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
