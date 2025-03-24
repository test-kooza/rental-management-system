import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from "@react-email/components";
  
  interface VerificationEmailProps {
    name: string;
    verificationCode: string;
    email: string;
  }
  
  export const VerificationEmail = ({ name, verificationCode, email }: VerificationEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Verify your host account on Arbnb</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoContainer}>
              <Text style={logoText}>Arbnb</Text>
            </Section>
            <Section style={content}>
              <Heading style={heading}>Host Account Verification</Heading>
              
              <Text style={paragraph}>Hi {name},</Text>
              <Text style={paragraph}>
                Thank you for choosing to become a host on Arbnb! To complete your host account setup, please enter the verification code below:
              </Text>
  
              <Section style={codeContainer}>
                <Text style={verificationCodeStyle}>{verificationCode}</Text>
              </Section>
  
              <Text style={paragraph}>
                This code will expire in 30 minutes. If you did not request to become a host, you can safely ignore this email.
              </Text>
  
              <Text style={paragraph}>
                Once verified, you'll be able to list properties, manage bookings, and start earning as an Arbnb host.
              </Text>
  
              <Text style={paragraph}>
                Best regards,<br />
                The Arbnb Team
              </Text>
            </Section>
  
            <Hr style={divider} />
  
            <Section style={footer}>
              <Text style={footerText}>© {new Date().getFullYear()} Arbnb. All rights reserved.</Text>
              <Text style={footerText}>
                This email was sent to {email}. If you have questions, please contact our support team.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  // Styles
  const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };
  
  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
  };
  
  const logoContainer = {
    padding: "20px",
    textAlign: "center" as const,
  };
  
  const logoText = {
    fontSize: "28px",
    fontWeight: "bold" as const,
    color: "#FF385C",
    margin: "0",
  };
  
  const content = {
    padding: "0 20px",
  };
  
  const heading = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
    color: "#333",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#333",
  };
  
  const codeContainer = {
    margin: "30px 0",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    textAlign: "center" as const,
  };
  
  const verificationCodeStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "8px",
    color: "#FF385C",
    margin: "0",
  };
  
  const divider = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  };
  
  const footer = {
    textAlign: "center" as const,
    padding: "0 20px",
  };
  
  const footerText = {
    fontSize: "12px",
    color: "#666",
    margin: "5px 0",
  };
  
  export default VerificationEmail;