function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-wrapper">
            <p>The Reading Cauldron</p>
            <p>&copy; {currentYear}</p>
            <p>Tu biblioteca personal</p>
           
        </footer>
    );
}

export default Footer;