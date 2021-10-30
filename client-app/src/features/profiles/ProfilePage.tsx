import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();

    useEffect(() => {
        profileStore.loadProfile(username);
    }, [profileStore, username])

    if (profileStore.loadingProfile) return <LoadingComponent content='Loading profile' />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profileStore.profile &&
                    <>
                        <ProfileHeader profile={profileStore.profile} />
                        <ProfileContent profile={profileStore.profile} />
                    </>
                }
            </Grid.Column>
        </Grid>
    )

})