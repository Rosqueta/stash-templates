const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  { slug: "general",     label_es: "General",    label_en: "General" },
  { slug: "writing",     label_es: "Redacción",  label_en: "Writing" },
  { slug: "design",      label_es: "Diseño",     label_en: "Design" },
  { slug: "development", label_es: "Desarrollo", label_en: "Development" },
  { slug: "analysis",    label_es: "Análisis",   label_en: "Analysis" },
  { slug: "meetings",    label_es: "Reuniones",  label_en: "Meetings" },
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const yamlBlock = match[1];
  const body = match[2].trim();

  const meta = {};
  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (value.startsWith("[")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else {
      meta[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }

  const parts = body.split(/\n---EN---\n/);
  const content_es = parts[0]?.trim() || "";
  const content_en = parts[1]?.trim() || "";

  return { meta, content_es, content_en };
}

function toId(filename) {
  return "tpl-" + filename.replace(/\.md$/, "").replace(/[^a-z0-9]+/g, "-");
}

const templates = [];

for (const cat of CATEGORIES) {
  const dir = path.join("templates", cat.slug);
  if (!fs.existsSync(dir)) continue;

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      console.warn(`Skipping ${file}: could not parse frontmatter`);
      continue;
    }

    const entry = {
      id: toId(file),
      title_es: parsed.meta.title_es || file.replace(/\.md$/, ""),
      title_en: parsed.meta.title_en || file.replace(/\.md$/, ""),
      category: cat.slug,
      tags: parsed.meta.tags || [],
      content_es: parsed.content_es,
      content_en: parsed.content_en,
    };

    if (parsed.meta.variables_es && parsed.meta.variables_es.length > 0) {
      entry.variables_es = parsed.meta.variables_es;
    }
    if (parsed.meta.variables_en && parsed.meta.variables_en.length > 0) {
      entry.variables_en = parsed.meta.variables_en;
    }

    templates.push(entry);
  }
}

const output = {
  version: 2,
  updatedAt: Math.floor(Date.now() / 1000),
  categories: CATEGORIES,
  templates,
};

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/templates.json", JSON.stringify(output, null, 2));
console.log(`✓ Generated ${templates.length} templates across ${CATEGORIES.length} categories`);
