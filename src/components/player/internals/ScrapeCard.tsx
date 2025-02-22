import classNames from "classnames";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  StatusCircle,
  StatusCircleProps,
} from "@/components/player/internals/StatusCircle";
import { Transition } from "@/components/utils/Transition";

export interface ScrapeItemProps {
  status:
    | "failure"
    | "pending"
    | "notfound"
    | "success"
    | "waiting"
    | "skipped";
  name: string;
  id?: string;
  percentage?: number;
  children?: ReactNode;
  skipCurrent?: () => void;
}

export interface ScrapeCardProps extends ScrapeItemProps {
  hasChildren?: boolean;
}

const statusTextMap: Partial<Record<ScrapeCardProps["status"], string>> = {
  notfound: "player.scraping.items.notFound",
  failure: "player.scraping.items.failure",
  pending: "player.scraping.items.pending",
  skipped: "player.scraping.items.skipped",
};

const statusMap: Record<ScrapeCardProps["status"], StatusCircleProps["type"]> =
  {
    failure: "error",
    notfound: "noresult",
    pending: "loading",
    success: "success",
    waiting: "waiting",
    skipped: "noresult",
  };

export function ScrapeItem(props: ScrapeItemProps) {
  const { t } = useTranslation();
  const text = statusTextMap[props.status];
  const status = statusMap[props.status];

  return (
    <div className="grid gap-4 grid-cols-[auto,1fr]" data-source-id={props.id}>
      <StatusCircle type={status} percentage={props.percentage ?? 0} />
      <div>
        <p
          className={
            status === "loading" ? "text-white" : "text-type-secondary"
          }
        >
          {props.name}
          {props.status === "pending" && (
            <button
              type="button"
              className="text-white hover:text-white/80 bg-video-scraping-card hover:bg-video-scraping-card/80 text-sm rounded-md px-3 py-1 ml-3 transition-colors"
              onClick={() => {
                if (props.skipCurrent) props.skipCurrent();
              }}
            >
              Skip
            </button>
          )}
        </p>
        <Transition animation="fade" show={!!text}>
          <p className="text-[15px] mt-1">{text ? t(text) : ""}</p>
        </Transition>
        {props.children}
      </div>
    </div>
  );
}

export function ScrapeCard(props: ScrapeCardProps) {
  return (
    <div data-source-id={props.id} className="w-80 mb-6">
      <div
        className={classNames({
          "!bg-opacity-100 py-6": props.hasChildren,
          "w-80 rounded-md px-6 bg-video-scraping-card bg-opacity-0": true,
        })}
      >
        <ScrapeItem {...props} />
      </div>
    </div>
  );
}
