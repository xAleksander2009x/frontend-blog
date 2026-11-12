import { Badge, Section } from "@gi-org-pl/athena";

export interface AboutBioProps {
  title: string;
  paragraphs: string[];
  interests: string[];
}

const AboutBio = ({ title, paragraphs, interests }: AboutBioProps) => {
  return (
    <Section title={title}>
      <div className="space-y-4">
        {paragraphs.map((text) => (
          <p
            key={text}
            className="break-words text-base leading-relaxed text-gi-dark-gray"
          >
            {text}
          </p>
        ))}

        {interests.length > 0 && (
          <div className="pt-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gi-primary">
              Interests & Technologies
            </h3>
            <ul className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <li key={interest}>
                  <Badge variant="secondary" type="info">
                    {interest}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
};

export default AboutBio;
