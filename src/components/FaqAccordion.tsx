import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
}

interface FaqAccordionProps {
  sections: FaqSection[];
  className?: string;
  defaultValue?: string;
}

/**
 * FaqAccordion component
 * 
 * Displays FAQ items in an accordion format, organized by sections
 */
const FaqAccordion: React.FC<FaqAccordionProps> = ({
  sections,
  className,
  defaultValue,
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="space-y-4">
          {section.title && (
            <h3 className="text-xl font-semibold">{section.title}</h3>
          )}
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultValue}
            className="border rounded-lg"
          >
            {section.items.map((item, itemIndex) => (
              <AccordionItem
                key={`item-${sectionIndex}-${itemIndex}`}
                value={`item-${sectionIndex}-${itemIndex}`}
                className={itemIndex === 0 ? "border-t-0" : ""}
              >
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
