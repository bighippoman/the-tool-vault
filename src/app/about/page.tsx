export const metadata = {
  title: 'About - NeuralStock.ai',
  description: 'Learn about NeuralStock.ai, our mission, and the tools we provide to make your work easier and more efficient.',
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          About NeuralStock.ai
        </h1>
        
        <div className="prose prose-lg dark:prose-invert">
          <p className="lead text-xl text-gray-800">
            NeuralStock.ai is a comprehensive collection of over 50+ online tools designed to make your work easier and more efficient, 
            powered by cutting-edge technology to enhance your productivity.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Our Story
          </h2>
          <p>
            Founded by Joseph Nordqvist in 2024, NeuralStock.ai began as a vision to democratize access to powerful online tools. 
            What started as a small project quickly evolved into a comprehensive platform featuring 
            dozens of intelligent tools across multiple categories, bringing the future of productivity to everyone.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p>
            Our mission is to create accessible, high-quality tools that help people 
            work smarter, not harder. We believe that powerful utilities should be available to everyone, regardless of technical 
            expertise or budget, ushering in a new era of productivity that&apos;s both efficient and intuitive.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            What We Offer
          </h2>
          <p>
            NeuralStock.ai features over 50+ powerful tools across multiple categories:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Development Tools:</strong> Code formatters, validators, encoders/decoders, and more.</li>
            <li><strong>Design Tools:</strong> Color utilities, image processors, and design generators.</li>
            <li><strong>Productivity Tools:</strong> Text processors, converters, and organization tools.</li>
            <li><strong>Marketing Tools:</strong> SEO utilities, analytics, and content tools.</li>
            <li><strong>Financial Tools:</strong> Calculators and financial planning utilities.</li>
            <li><strong>Utility Tools:</strong> General-purpose tools for everyday tasks.</li>
            <li><strong>Health Tools:</strong> Health calculators and wellness tracking tools.</li>
            <li><strong>Educational Tools:</strong> Learning aids and educational resources.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            About the Founder
          </h2>
          <p>
            Joseph Nordqvist is a passionate web developer with a background in software engineering and user experience design. 
            Joseph created NeuralStock.ai to bridge the gap between advanced technology and everyday productivity needs, 
            making powerful tools accessible to everyone while ensuring they remain intuitive and user-friendly.
          </p>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Our Values
          </h2>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Accessibility:</strong> Most tools are free to use with no registration required, though certain premium features may require user signup or subscription.</li>
            <li><strong>Privacy:</strong> We do not collect personal data unless explicitly provided, and all data is handled securely.</li>
            <li><strong>Simplicity:</strong> Our tools are designed to be intuitive and easy to use, despite being powered by sophisticated technology.</li>
            <li><strong>Quality:</strong> We leverage cutting-edge technology to ensure accuracy and reliability in all our tools.</li>
            <li><strong>Community:</strong> We welcome feedback and suggestions for new features and improvements.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-10 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p>
            We&apos;re passionate about creating tools that make your work easier and more efficient. Whether you&apos;re a developer, designer, marketer, or just someone who loves useful tools, we&apos;ve got something for you. Have a question, suggestion, or feedback about our tools? We&apos;d love to hear from you! 
            You can reach us at <a href="mailto:hello@neuralstock.ai" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold">hello@neuralstock.ai</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
