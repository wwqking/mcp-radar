import { getAllServers } from "@/lib/data";
import { toSearchServers } from "@/lib/search";

export const dynamic = "force-static";

export async function GET() {
  const servers = toSearchServers(await getAllServers());

  return Response.json(
    { servers },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
