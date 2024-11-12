import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Twitter,
  Info,
} from "lucide-react";
import { Card, CardContent } from "../_components/ui/card";

const ProjectCard = ({ project }) => {
  // Remove the % and + symbols from change string and convert to number
  const changeValue = parseFloat(project.change_1m.replace(/[+%]/g, ""));

  // Remove the $ and m symbols from TVL string
  const tvlValue = project?.tvl?.replace(/[$m]/g, "");

  return (
    <Card className="bg-[#27272A] border-zinc-800 hover:bg-[#2D2D30] transition-all duration-200">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#1C1C1F] flex items-center justify-center text-xl font-bold text-[#FF9100]">
                {project?.symbol?.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {project?.name}
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#1C1C1F] text-white/70">
                    {project?.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#FF9100]">
                    {project?.category}
                  </span>
                  <span className="text-xs text-white/30">•</span>
                  <span className="text-sm text-white/50">
                    {project?.chain}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-right mb-2">
              <p className="text-sm text-white/50 mb-1">TVL</p>
              <p className="text-xl font-bold text-white">{project?.tvl}</p>
            </div>
            <div
              className={`flex items-center px-2 py-1 rounded-lg ${
                changeValue >= 0
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {changeValue >= 0 ? (
                <ArrowUpRight size={16} className="mr-1" />
              ) : (
                <ArrowDownRight size={16} className="mr-1" />
              )}
              <span className="text-sm font-medium">{project?.change_1m}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-white/70 line-clamp-2">
          {project?.description}
        </p>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              <span>Website</span>
            </a>
            <a
              href={`https://twitter.com/${project.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <Twitter size={14} />
              <span>@{project?.twitter}</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-zinc-700 text-white/70 hover:text-white rounded-lg hover:bg-[#1C1C1F] transition-all">
              Analytics
            </button>
            <button className="px-3 py-1.5 text-sm bg-[#FF9100] text-white rounded-lg hover:bg-[#FF9100]/90 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsList = ({ projects }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Top Protocols</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm bg-[#FF9100] text-white rounded-lg">
            TVL
          </button>
          <button className="px-3 py-1.5 text-sm bg-[#27272A] text-white/70 hover:bg-[#323232] rounded-lg">
            Name
          </button>
          <button className="px-3 py-1.5 text-sm bg-[#27272A] text-white/70 hover:bg-[#323232] rounded-lg">
            Change
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
