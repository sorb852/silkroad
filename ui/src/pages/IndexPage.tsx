import { useQuery } from "@apollo/client";
import type { ComponentType, ReactNode } from "react";
import {
  IconBook,
  IconDatabase,
  IconExternalLink,
  IconLayoutDashboard,
  IconSandbox,
  IconSettings,
} from "@tabler/icons-react";
// Root imports on purpose: core-ui shares `erxes-ui`/`ui-modules` as Module
// Federation singletons keyed on the bare specifier, so deep imports would
// bundle second private copies instead of reusing the host's.
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Separator,
  Skeleton,
  cn,
} from "erxes-ui";
import { PageHeader } from "ui-modules";
import { Link } from "react-router";
import manifest from "../../../erxes.json" with { type: "json" };
import { STATUS_QUERY } from "../graphql";
import { Samples } from "../Samples";

const { path } = manifest.ui;

const Dot = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "silkroad:inline-block silkroad:size-2 silkroad:rounded-full",
      className,
    )}
  />
);

const StatusRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="silkroad:flex silkroad:items-center silkroad:justify-between silkroad:gap-4 silkroad:text-sm">
    <span className="silkroad:text-muted-foreground">{label}</span>
    <span className="silkroad:flex silkroad:items-center silkroad:gap-2 silkroad:font-medium">
      {children}
    </span>
  </div>
);

const ConnectionCard = () => {
  const { data, loading, error, refetch } = useQuery(STATUS_QUERY);
  const status = data?.silkroadStatus;

  const pending = (
    <>
      <Dot className="silkroad:animate-pulse silkroad:bg-muted-foreground" />
      <Skeleton className="silkroad:h-4 silkroad:w-24" />
    </>
  );

  return (
    <Card className="silkroad:w-full silkroad:md:w-80 silkroad:shrink-0">
      <Card.Header>
        <Card.Title className="silkroad:text-sm">Connection</Card.Title>
        <Card.Description>
          Live status of this plugin inside erxes
        </Card.Description>
      </Card.Header>
      <Card.Content className="silkroad:flex silkroad:flex-col silkroad:gap-3">
        <StatusRow label="API">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="silkroad:bg-destructive" />
              <span>Unreachable</span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </>
          ) : (
            <>
              <Dot className="silkroad:bg-success" />
              <span>Connected · v{status?.version}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Gateway">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="silkroad:bg-destructive" />
              <span
                className="silkroad:truncate silkroad:max-w-40"
                title={error.message}
              >
                {error.message}
              </span>
            </>
          ) : (
            <>
              <Dot className="silkroad:bg-success" />
              <span>Federated as {status?.plugin}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Tenant">
          {loading ? pending : (status?.subdomain ?? "—")}
        </StatusRow>
        <StatusRow label="Signed in">
          {loading
            ? pending
            : (status && (status.userEmail ?? status.userId ?? "Anonymous")) ||
              "—"}
        </StatusRow>
      </Card.Content>
    </Card>
  );
};

const StepCard = ({
  icon: Icon,
  title,
  description,
  code,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  code: string;
}) => (
  <Card>
    <Card.Header>
      <div className="silkroad:flex silkroad:size-9 silkroad:items-center silkroad:justify-center silkroad:rounded-lg silkroad:bg-accent">
        <Icon className="silkroad:size-5" />
      </div>
      <Card.Title>{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content>
      <code className="silkroad:rounded silkroad:bg-muted silkroad:px-1.5 silkroad:py-0.5 silkroad:font-mono silkroad:text-xs">
        {code}
      </code>
    </Card.Content>
  </Card>
);

const STEPS = [
  {
    icon: IconDatabase,
    title: "Model your data",
    description:
      "Define the records this plugin owns and expose them on the federated graph.",
    code: "api/src/modules/sample",
  },
  {
    icon: IconLayoutDashboard,
    title: "Build the page",
    description:
      "Replace this overview with your module: lists with RecordTable, forms with Form, details in a Sheet.",
    code: "ui/src/pages/IndexPage.tsx",
  },
];

export const IndexPage = () => (
  <div className="silkroad:flex silkroad:h-full silkroad:flex-col">
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="silkroad:gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/${path}`}>
                  <IconSandbox />
                  {manifest.title}
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton
          breadcrumb={[manifest.title]}
          icon="IconSandbox"
        />
      </PageHeader.Start>
      <PageHeader.End>
        <Button variant="outline" asChild>
          <Link to={`/${path}/settings`}>
            <IconSettings />
            Settings
          </Link>
        </Button>
      </PageHeader.End>
    </PageHeader>
    <div className="silkroad:flex-1 silkroad:overflow-auto">
      <div className="silkroad:mx-auto silkroad:flex silkroad:w-full silkroad:max-w-5xl silkroad:flex-col silkroad:gap-6 silkroad:p-6">
        <section className="silkroad:relative silkroad:overflow-hidden silkroad:rounded-xl silkroad:border silkroad:border-border silkroad:bg-background silkroad:p-8 silkroad:shadow-xs">
          <div
            aria-hidden
            className="silkroad:pointer-events-none silkroad:absolute silkroad:inset-0 silkroad:bg-gradient-to-br silkroad:from-primary/10 silkroad:via-transparent silkroad:to-transparent"
          />
          <div className="silkroad:relative silkroad:flex silkroad:flex-col silkroad:gap-6 silkroad:md:flex-row silkroad:md:items-start silkroad:md:justify-between">
            <div className="silkroad:flex silkroad:max-w-xl silkroad:flex-col silkroad:gap-4">
              <div>
                <Badge variant="info">Plugin · v{manifest.version}</Badge>
              </div>
              <h1 className="silkroad:text-2xl silkroad:font-semibold silkroad:tracking-tight">
                Welcome to {manifest.title}
              </h1>
              <p className="silkroad:text-sm silkroad:leading-relaxed silkroad:text-muted-foreground">
                {manifest.description}
              </p>
              <div className="silkroad:flex silkroad:flex-wrap silkroad:gap-2">
                <Button asChild>
                  <Link to={`/${path}/settings`}>
                    <IconSettings />
                    Open settings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://erxes.io/docs/create-plugin-standalone"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconBook />
                    Developer guide
                    <IconExternalLink />
                  </a>
                </Button>
              </div>
            </div>
            <ConnectionCard />
          </div>
        </section>
        <Samples />
        <div className="silkroad:grid silkroad:gap-4 silkroad:md:grid-cols-2">
          {STEPS.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
