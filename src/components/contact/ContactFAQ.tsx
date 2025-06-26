import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ContactFAQ = () => {
  const faqs = [
    {
      question: "How do I get started with NeuralStock.ai tools?",
      answer: "Simply browse our collection of 1000+ AI-powered tools and start using them immediately. No signup required for most tools, and everything runs in your browser for maximum privacy."
    },
    {
      question: "Are the tools really free to use?",
      answer: "Yes! All tools on NeuralStock.ai are completely free to use. We don't require any payment or subscription."
    },
    {
      question: "How do you ensure data privacy?",
      answer: "We prioritize privacy by processing most data locally in your browser. When server processing is needed, we use secure, encrypted connections and don't store your personal data."
    },
    {
      question: "Can I use these tools for commercial projects?",
      answer: "Absolutely! Our tools are designed for both personal and commercial use. There are no restrictions on using the output for your business or client projects."
    },
    {
      question: "What if I encounter a bug or have a feature request?",
      answer: "We'd love to hear from you! Use the contact form above to report bugs or suggest new features. We actively work on improvements based on user feedback."
    },
    {
      question: "Do you offer API access to your tools?",
      answer: "We're currently developing API access for developers. Contact us if you're interested in early access or have specific integration needs."
    }
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">Frequently Asked Questions</CardTitle>
        <CardDescription>
          Quick answers to common questions. Don&apos;t see what you&apos;re looking for? Contact us!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ContactFAQ;
