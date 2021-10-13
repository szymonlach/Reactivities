import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";


export default observer(function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity} = activityStore;
    if(!selectedActivity) return <LoadingComponent/>
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activityStore.selectedActivity?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity?.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activityStore.selectedActivity?.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => activityStore.openForm(activityStore.selectedActivity?.id)} basic color='blue' content='Edit' />
                    <Button onClick={()=> activityStore.cancelSelectActivity()} basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})