import CommandResult from "../CommandResult";
import IApp from "../../../../core/types/app/IApp";
import parseAppStateURL from "../../../../core/utils/parseAppStateURL";
import resolveUrl from "../../../../utils/resolveUrl";
import siteConfig from "../../../../SiteConfig";

class NavigateCommandResult extends CommandResult {
    private to: string;

    constructor(to: string, label?: string) {
        const resolved = resolveUrl(to);

        if (label) {
            super(label, resolved);
        } else {
            super("Navigate to " + resolved)
        }

        this.to = resolved;
    }

    public activate(app: IApp) {
        const state = parseAppStateURL(this.to);

        if (!state || !this.to.startsWith(siteConfig.path.base)) {
            location.assign(this.to);
        } else {
            app.views.createAndSetupViewWithFallbacks(state.viewName, state)
                .then(viewWithFallbackStatus => {
                    if (viewWithFallbackStatus.isFallback) {
                        location.assign(this.to);
                    } else {
                        app.views.switch(viewWithFallbackStatus.view);
                    }
                });
        }
    }
}

export default NavigateCommandResult;