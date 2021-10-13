import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";



export default observer(function ActivityForm() {

    const { activityStore } = useStore();
    const initialState = activityStore.selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? activityStore.updateActivity(activity) : activityStore.createActivity(activity);
    }

    function handleImputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='auto'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleImputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleImputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleImputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleImputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleImputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleImputChange} />
                <Button loading={activityStore.loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={()=> activityStore.closeForm()} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})