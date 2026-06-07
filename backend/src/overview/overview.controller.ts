import { Controller, Get, Query } from "@nestjs/common";
import { OverviewService } from "./overview.service";

@Controller()
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) { }

  @Get("health")
  health() {
    return this.overviewService.getHealth();
  }

  @Get("api/health")
  apiHealth() {
    return this.overviewService.getHealth();
  }

  @Get("overview")
  overview(@Query("owner") owner?: string, @Query("priority") priority?: string) {
    return this.overviewService.getOverview(owner, priority);
  }

  @Get("api/overview")
  apiOverview(@Query("owner") owner?: string, @Query("priority") priority?: string) {
    return this.overviewService.getOverview(owner, priority);
  }
}
