import path from "path";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { promises as fs, readFileSync, existsSync } from "fs";

// 로컬 폰트 파일 로드
const fontPath = path.join(process.cwd(), "fonts", "NotoSansKR-Regular.ttf");
let fontArrayBuffer;

try {
  const fontBuffer = readFileSync(fontPath);
  fontArrayBuffer = Uint8Array.from(fontBuffer).buffer;
  console.log("✅ 폰트 파일 로드 성공");
} catch (error) {
  console.error(`❌ 폰트 파일을 찾을 수 없습니다: ${fontPath}`);
  console.error("기본 폰트를 사용합니다.");
  fontArrayBuffer = null;
}

// 썸네일 생성
async function generateThumbnail(mdxPath) {
  try {
    const markdownFile = await fs.readFile(mdxPath, "utf-8");
    const { data } = matter(markdownFile);

    if (!data.title) {
      console.log(`Skipping ${mdxPath}: No title found`);
      return;
    }

    console.log(`Generating thumbnail for: ${data.title}`);

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "40px",
            boxSizing: "border-box",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  fontSize: "48px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "20px",
                  lineHeight: "1.2",
                  maxWidth: "1000px",
                },
                children: data.title,
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: fontArrayBuffer
          ? [
              {
                name: "Noto Sans KR",
                data: fontArrayBuffer,
                weight: 400,
                style: "normal",
              },
            ]
          : [],
      }
    );

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const relativePath = mdxPath.replace(/\/[^\/]+\.mdx?$/, "");
    const thumbnailPath = path.join(relativePath, "thumbnail.png");
    await fs.writeFile(thumbnailPath, pngBuffer);

    console.log(`✅ Generated thumbnail: ${thumbnailPath}`);
  } catch (error) {
    console.error(`❌ Error generating thumbnail for ${mdxPath}:`, error);
  }
}

// 재귀적으로 모든 파일 가져오기
async function getAllFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

// 전체 썸네일 생성
async function generateAllThumbnails() {
  try {
    const contentsDir = path.join(process.cwd(), "src");
    if (!existsSync(contentsDir)) {
      console.log("src 디렉토리가 존재하지 않습니다.");
      return;
    }

    const files = await getAllFiles(contentsDir);
    const mdxFiles = files.filter(
      (file) => file.endsWith(".mdx") || file.endsWith(".md")
    );

    console.log(`📝 Found ${mdxFiles.length} MDX/MD files`);

    for (const file of mdxFiles) {
      await generateThumbnail(file);
    }

    console.log("🎉 All thumbnails generated successfully!");
  } catch (error) {
    console.error("❌ Error generating thumbnails:", error);
  }
}

// 실행
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await generateAllThumbnails();
  } else {
    for (const file of args) {
      if (file.endsWith(".mdx") || file.endsWith(".md")) {
        if (existsSync(file)) {
          await generateThumbnail(file);
        } else {
          console.log(`File not found: ${file}`);
        }
      }
    }
  }
}

main().catch(console.error);
