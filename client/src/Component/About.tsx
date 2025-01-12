function About() {
  const styles = {
    container: {
      color: "#fff", // Light text color
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    sectionContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#2d2d2d",
    },
    heading: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    subHeading: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#f39c12", // Accent color
    },
    paragraph: {
      fontSize: "16px",
      lineHeight: "1.8",
      marginBottom: "20px",
      textAlign: "justify" as const,
    },
    listHeading: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#3498db", // Accent color
    },
    emphasis: {
      color: "#e74c3c", // Emphasis color for highlights
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sectionContainer}>
        <h1 style={styles.heading}>About Us</h1>
        <h3 style={styles.subHeading}>About CodeGalaxy:</h3>
        <p style={styles.paragraph}>
          CodeGalaxy is a leading platform that provides computer science
          resources and coding challenges for programmers and technology
          enthusiasts, along with interview and exam preparations for upcoming
          aspirants. With a strong emphasis on enhancing coding skills and
          knowledge, it has become a trusted destination for over 12 million
          registered users worldwide.
        </p>
        <p style={styles.paragraph}>
          Our exceptional mentors, hailing from top colleges and organizations,
          guide users on their journey from the basics of coding to mastering
          the most advanced concepts. We empower individuals to bridge the gap
          between academia and industry while promoting growth in the
          ever-evolving field of computer science.
        </p>

        <h3 style={styles.subHeading}>
          2. Corporate History, Mission, Vision, and Motto:
        </h3>
        <p style={styles.paragraph}>
          <strong style={styles.listHeading}>Corporate History:</strong>
          CodeGalaxy was founded in 2023 by <span style={styles.emphasis}>Nikhil Gehlot</span>, with
          a vision to establish a comprehensive platform for computer science
          education and skill development.
        </p>
        <p style={styles.paragraph}>
          <strong style={styles.listHeading}>Mission:</strong> To empower
          programmers worldwide by bridging the gap between theory and practice.
        </p>
        <p style={styles.paragraph}>
          <strong style={styles.listHeading}>Vision:</strong> To become the
          definitive platform for programmers to stay at the forefront of
          technology and career excellence.
        </p>
        <p style={styles.paragraph}>
          <strong style={styles.listHeading}>Motto:</strong> "Learn, Practice,
          and Excel" - emphasizing continuous learning, practice, and
          excellence.
        </p>

        <h3 style={styles.subHeading}>3. Company Founders/Directors:</h3>
        <p style={styles.paragraph}>
          <span style={styles.emphasis}>Nikhil Gehlot</span>, founder, is a
          visionary entrepreneur passionate about education and coding.{" "}
          <span style={styles.emphasis}>Suyash Indalkar</span>, CTO, has
          revolutionized CodeGalaxy with innovative solutions and a commitment
          to excellence.
        </p>
      </div>
    </div>
  );
}

export default About;
