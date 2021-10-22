import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";


export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { selectedActivity } = activityStore;

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) activityStore.loadActivity(id);
    }, [id, activityStore.loadActivity, activityStore])

    if (activityStore.loadingInitial || !activityStore.selectedActivity) return <LoadingComponent />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={selectedActivity!} />
                <ActivityDetailedInfo activity={selectedActivity!} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={selectedActivity!}/>
            </Grid.Column>
        </Grid>
    )
})