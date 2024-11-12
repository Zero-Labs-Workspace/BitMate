import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

export const ProjectCard = ({ project }: { project: any }) => (
    <Card className="bg-[#27272A] border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-[80px] h-[80px]">
            <Image
              src={`https://icons.llamao.fi/icons/protocols/${project?.slug}?w=80&h=80`}
              alt={project?.name}
              width={80}
              height={80}
              className="rounded-lg bg-[#1C1C1F]"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {project?.name}
                </h3>
                <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-[#FF9100]/10 text-[#FF9100] mb-2">
                  {project?.category}
                </span>
                <p className="text-sm text-white/70 line-clamp-2 mb-4">
                  {project?.description}
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-white/50">TVL</p>
                    <p className="text-white font-semibold">{project?.tvl}</p>
                  </div>
                  {project?.change_1m && (
                    <div>
                      <p className="text-sm text-white/50">30d Change</p>
                      <p
                        className={`font-semibold ${
                          project?.change_1m.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {project?.change_1m}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {project.url && (
                <Link
                  href={project?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white"
                >
                  <ExternalLink size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );