const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  { slug: "general", label: "General" },
  { slug: "writing", label: "Writing" },
  { slug: "design", label: "Design" },
  { slug: "development", label: "Development" },
  { slug: "analysis", label: "Analysis" },
  { slug: "meetings", label: "Meetings" },
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

  return { meta, body };
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
      title: parsed.meta.title || file.replace(/\.md$/, ""),
      category: cat.slug,
      tags: parsed.meta.tags || [],
      content: parsed.body,
    };

    if (parsed.meta.variables && parsed.meta.variables.length > 0) {
      entry.variables = parsed.meta.variables;
    }

    templates.push(entry);
  }
}

const output = {
  version: 1,
  updatedAt: Math.floor(Date.now() / 1000),
  categories: CATEGORIES,
  templates,
};

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/templates.json", JSON.stringify(output, null, 2));
console.log(`✓ Generated ${templates.length} templates across ${CATEGORIES.length} categories`);
