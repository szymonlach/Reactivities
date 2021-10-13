import React, { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails"
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();

    useEffect(() => {
        if (activityStore.activityRegistry.size <= 1) activityStore.loadActivities();
    }, [activityStore.activityRegistry.size, activityStore.loadActivities])

    if(activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

    return (
        <Grid>
            <GridColumn width='10'>
                <ActivityList />
            </GridColumn>
            <GridColumn width='6'>
                <h2>Activity filters</h2>
            </GridColumn>
        </Grid>
    )
})