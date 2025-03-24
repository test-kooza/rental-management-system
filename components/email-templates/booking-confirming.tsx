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
  } from "@react-email/components"
  import { format } from "date-fns"
import Logo from "../frontend/Logo"
  
  interface BookingConfirmationEmailProps {
    booking: any
  }
  
  export const BookingConfirmationEmail = ({ booking }: BookingConfirmationEmailProps) => {
    const formatDate = (date: string | Date) => {
      return format(new Date(date), "MMMM dd, yyyy")
    }
  
    // Convert Decimal objects to strings or numbers
    const formatAmount = (amount: any) => {
      // Check if it's a Decimal object
      if (amount && typeof amount === 'object' && amount.toString) {
        return amount.toString();
      }
      // If it's already a number or string, return it directly
      return amount;
    }
  
    return (
      <Html>
        <Head />
        <Preview>Your booking has been confirmed!</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoContainer}>
             <Logo/>
            </Section>
            <Section style={content}>
              <Heading style={heading}>Booking Confirmation</Heading>
              <Text style={paragraph}>Dear {booking.guest?.name || "Guest"},</Text>
              <Text style={paragraph}>Your booking has been confirmed! Here are the details of your stay:</Text>
  
              <Section style={bookingDetails}>
                <Heading as="h2" style={subheading}>
                  Booking Reference: {booking.bookingNumber}
                </Heading>
  
                <Row style={propertyRow}>
                  <Column>
                    <Img
                      src={booking.property?.images?.[0] || "/placeholder.jpg"}
                      width="200"
                      height="150"
                      alt={booking.property?.title || "Property"}
                      style={propertyImage}
                    />
                  </Column>
                  <Column style={propertyInfo}>
                    <Text style={propertyTitle}>{booking.property?.title}</Text>
                    <Text style={propertyAddress}>
                      {booking.property?.address?.city}, {booking.property?.address?.country}
                    </Text>
                  </Column>
                </Row>
  
                <Hr style={divider} />
  
                <Section style={detailsSection}>
                  <Row>
                    <Column>
                      <Text style={detailLabel}>Check-in:</Text>
                    </Column>
                    <Column>
                      <Text style={detailValue}>{formatDate(booking.checkInDate)}</Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Text style={detailLabel}>Check-out:</Text>
                    </Column>
                    <Column>
                      <Text style={detailValue}>{formatDate(booking.checkOutDate)}</Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Text style={detailLabel}>Guests:</Text>
                    </Column>
                    <Column>
                      <Text style={detailValue}>
                        {booking.adults} {booking.adults === 1 ? "adult" : "adults"}
                        {booking.children > 0 && `, ${booking.children} ${booking.children === 1 ? "child" : "children"}`}
                        {booking.infants > 0 && `, ${booking.infants} ${booking.infants === 1 ? "infant" : "infants"}`}
                      </Text>
                    </Column>
                  </Row>
                </Section>
  
                <Hr style={divider} />
  
                <Section style={pricingSection}>
                  <Heading as="h3" style={pricingSectionHeading}>
                    Payment Details
                  </Heading>
                  <Row>
                    <Column>
                      <Text style={priceLabel}>Total Amount:</Text>
                    </Column>
                    <Column>
                      <Text style={priceValue}>${formatAmount(booking.totalAmount)}</Text>
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Text style={priceLabel}>Payment Status:</Text>
                    </Column>
                    <Column>
                      <Text style={priceValue}>Paid</Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
  
              <Text style={paragraph}>
                If you have any questions or need to make changes to your booking, please contact your host or our support
                team.
              </Text>
  
              <Section style={ctaContainer}>
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings`} style={button}>
                  View Booking Details
                </Link>
              </Section>
  
              <Text style={paragraph}>Thank you for choosing to stay with us!</Text>
  
              <Text style={paragraph}>
                Best regards,
                <br />
                The Team
              </Text>
            </Section>
  
            <Hr style={divider} />
  
            <Section style={footer}>
              <Text style={footerText}>© {new Date().getFullYear()} Your Company. All rights reserved.</Text>
              <Text style={footerText}>123 Main St, City, Country</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    )
  }
  
  // Styles
  const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  }
  
  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
  }
  
  const logoContainer = {
    padding: "20px",
    textAlign: "center" as const,
  }
  
  const content = {
    padding: "0 20px",
  }
  
  const heading = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
    color: "#333",
  }
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#333",
  }
  
  const bookingDetails = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
  }
  
  const subheading = {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
  }
  
  const propertyRow = {
    margin: "20px 0",
  }
  
  const propertyImage = {
    borderRadius: "4px",
  }
  
  const propertyInfo = {
    paddingLeft: "15px",
  }
  
  const propertyTitle = {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
  }
  
  const propertyAddress = {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  }
  
  const divider = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  }
  
  const detailsSection = {
    margin: "20px 0",
  }
  
  const detailLabel = {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0",
  }
  
  const detailValue = {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "5px 0",
  }
  
  const pricingSection = {
    margin: "20px 0",
  }
  
  const pricingSectionHeading = {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "10px 0",
  }
  
  const priceLabel = {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0",
  }
  
  const priceValue = {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "5px 0",
  }
  
  const ctaContainer = {
    textAlign: "center" as const,
    margin: "30px 0",
  }
  
  const button = {
    backgroundColor: "#FF385C",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 20px",
  }
  
  const footer = {
    textAlign: "center" as const,
    padding: "0 20px",
  }
  
  const footerText = {
    fontSize: "12px",
    color: "#666",
    margin: "5px 0",
  }
  
  export default BookingConfirmationEmail