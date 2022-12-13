import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategorySelector from "../../components/CategorySelector"
import styles from "../../styles/Home.module.css"
import Link from "next/link"

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                setState({ ...state, ["left"]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 250, height: "100%", backgroundColor: "#2f3c5a" }}
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <div className={styles.drawerList}>
                <CategorySelector onChangeCategory={() => {
                    toggleDrawer(anchor, false)
                    setState({ ...state, ["left"]: false })
                }}></CategorySelector>
                <Link legacyBehavior href="/discover">
                    <a className={styles.drawerItem} onClick={toggleDrawer(anchor, false)}>
                        Discover
                    </a>
                </Link>

                <Link legacyBehavior href="/info">
                    <a className={styles.drawerItem} onClick={toggleDrawer(anchor, false)}>
                        How It Works
                    </a>
                </Link>

                <Link legacyBehavior href="/myfunds">
                    <a className={styles.drawerItem} onClick={toggleDrawer(anchor, false)}>
                        My Fundraisers
                    </a>
                </Link>

                <Link legacyBehavior href="/form">
                    <a className={styles.drawerItem} onClick={toggleDrawer(anchor, false)}>
                        Create New Fund
                    </a>
                </Link>
            </div>
        </Box>
    );

    return (
        <div>
            {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>{
                        <FontAwesomeIcon icon={["fas", "bars"]} className={styles.menuBar}></FontAwesomeIcon>
                    }</Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
