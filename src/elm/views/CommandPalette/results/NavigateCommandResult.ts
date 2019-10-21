import CommandResult from "../CommandResult";
import IApp from "../../../../core/types/app/IApp";
import parseAppStateURL from "../../../../core/utils/parseAppStateURL";
import resolveUrl from "../../../../utils/resolveUrl";
import siteConfig from "../../../../SiteConfig";

class NavigateCommandResult extends CommandResult {
    private resolved: string;
    private to: string;

    constructor(to_: string, label?: string) {
        let to = to_;
        if (to[to.length - 1] === "?") {
            to = to.slice(0, to.length - 1);
        }

        const resolved = resolveUrl(to);

        if (label) {
            super(label, resolved);
        } else {
            super("Navigate to " + resolved)
        }

        this.resolved = resolved;
        this.to = to;
    }

    public activate(app: IApp) {
        const state = parseAppStateURL(this.resolved);

        if (!state || !this.resolved.startsWith(siteConfig.path.base)) {
            location.assign(this.resolved);
        } else {
            app.views.createAndSetupViewWithFallbacks(state.viewPath, state)
                .then(viewWithFallbackStatus => {
                    if (viewWithFallbackStatus.isFallback) {
                        location.assign(this.resolved);
                    } else {
                        app.views.switch(viewWithFallbackStatus.view);
                    }
                });
        }
    }

    public onTab(): string {
        return "/" + this.to + "?";
    }
}

export default NavigateCommandResult;