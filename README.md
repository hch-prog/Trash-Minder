# Trash-Minder ♻️

**Trash-Minder** is an AI-powered waste management app designed to promote cleaner communities by enabling users to report waste and track clean-up efforts through live verification. By uploading photos, Trash-Minder analyzes and verifies waste types, estimates the amount, and rewards users for reporting and cleaning up waste in their surroundings.

---

## Overview 🌍

Keeping the environment clean has never been easier with Trash-Minder. The platform utilizes AI and geolocation to identify waste, verify clean-up efforts, and incentivize users through a reward system. By reporting waste with a simple photo, users contribute to a cleaner community and earn rewards along the way.

With real-time verification and AI-based analysis, Trash-Minder makes waste reporting and management both simple and rewarding.

---

## Features ✨

### 📷 AI-Powered Waste Verification
- **Upload Waste Photos:** Report waste by uploading images directly from your phone or device.
- **AI Verification:** Our AI system analyzes the waste in the photo, identifying the waste type (plastic, metal, organic, etc.) and providing an estimated amount for collection.
  
### 🧹 Waste Clean-Up Confirmation
- **Photo-Based Clean-Up Tracking:** After waste is reported, users or clean-up teams upload another image after the area has been cleaned.
- **AI Clean-Up Confirmation:** The AI system compares images to confirm that the waste has been successfully cleared.

### 🎖️ Reward Points for Waste Reporting and Clean-Up
- **Earn Points:** Users are rewarded with points for each waste report and confirmed clean-up.
- **Redeem Rewards:** Accumulated points can be redeemed for various rewards, promoting continued engagement in maintaining a clean environment.

### 📍 Location-Based Waste Reporting
- **Geo-Tagged Submissions:** Each waste report is tagged with location data, enabling local authorities or service providers to respond quickly.
- **Live Map:** View waste reports in your area or track clean-up progress.

### 🔒 Secure Authentication
- **NextAuth Integration:** Secure and seamless user authentication with NextAuth, ensuring that your waste reporting data is safe.
- **Data Privacy:** All data is securely stored and encrypted, prioritizing user privacy and environmental impact tracking.

---

## Tech Stack 🛠️

- **Next.js:** For fast, server-side rendering and modern web development.
- **TypeScript:** Ensuring type safety across the codebase for fewer bugs and better maintainability.
- **NextAuth:** For secure authentication, providing easy user sign-up and login functionality.
- **Prisma:** A powerful, type-safe ORM for database management and handling waste reporting data efficiently.
- **Tailwind CSS:** Utilized for building a sleek, responsive, and modern user interface.
- **AI Integration:** AI Gemmni model process images for waste verification, categorization, and clean-up confirmation.
- **PostgreSQL**: Used for efficient storage of waste reports, clean-up data, and user reward points.

---

## Getting Started 🚀

Follow these steps to run **Trash-Minder** locally:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/hch-prog/trash-minder.git
    cd trash-minder
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**
    Create a `.env` file in the root directory and configure the following environment variables:

    ```bash
    DATABASE_URL=<your-prisma-database-url>
    NEXTAUTH_URL=<your-next-auth-url>
    NEXTAUTH_SECRET=<your-next-auth-secret>
    ```

4. **Migrate the Database:**
    ```bash
    npx prisma migrate dev
    ```

5. **Run the Development Server:**
    ```bash
    npm run dev
    ```

6. **Access the Application:**
    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---


