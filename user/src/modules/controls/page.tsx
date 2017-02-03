namespace controls {
    function getChildren(props): Array<any> {
        props = props || {};
        let children = [];
        if (props['children'] instanceof Array) {
            children = props['children'];
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }

    export class PageComponent extends React.Component<{}, {}>{
        render() {
            let children = getChildren(this.props);
            let header = children.filter(o => o instanceof PageHeader)[0];
            let footer = children.filter(o => o instanceof PageFooter)[0];
            let bodies = children.filter(o => !(o instanceof PageHeader) && !(o instanceof PageFooter));
            let views = children.filter(o => o instanceof PageView);
            return (
                <div>
                    {header != null ? (header) : null}
                    {bodies.map(o => (o))}
                    {footer != null ? (footer) : null}
                </div>
            );
        }
    }

    export class PageHeader extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}> {
        static tagName = 'HEADER';
        element: HTMLElement;

        render() {
            let children = getChildren(this.props);
            return (
                <header ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                    {children.map(o => (o))}
                </header>
            );
        }
    }

    export class PageFooter extends React.Component<React.Props<PageHeader> & { style?: React.CSSProperties }, {}>{
        static tagName = 'FOOTER';
        element: HTMLElement;

        render() {
            let children = getChildren(this.props);
            return (
                <footer ref={(o: HTMLElement) => this.element = o} style={this.props.style}>
                    {children.map(o => (o))}
                </footer>
            );
        }
    }

    let easing = BezierEasing(0.42, 0, 1, 1);

    /** 是否为安卓系统 */
    let isAndroid = navigator.userAgent.indexOf('Android') > -1;
    let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0

    export class PageView extends React.Component<React.Props<PageView> & { className?: string, style?: React.CSSProperties }, {}>{

        static tagName = 'SECTION';

        element: HTMLElement;

        protected componentDidMount() {
            if (isAndroid) {
                let start: number;

                //======================================
                let scroller = this.element as HTMLElement;
                scroller.style.transition = '0';

                var hammer = new Hammer.Manager(scroller, { touchAction: 'auto' });
                var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
                let moving: 'moveup' | 'movedown' = null;

                hammer.add(pan);
                hammer.on('panmove', (event) => {
                    console.log('deltaY:' + event.deltaY);
                    if (scroller.scrollTop <= 0) {
                        moving = 'movedown';
                    }
                    else if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                        moving = 'moveup';
                    }

                    if (moving) {
                        event.srcEvent.preventDefault();
                        this.element.style.touchAction = 'none';
                        let distance = easing(event.distance / 1000) * 1000;
                        if (moving == 'movedown') {
                            scroller.style.transform = `translateY(${distance}px)`;
                            scroller.setAttribute('data-scrolltop', `${0 - distance}`);
                        }
                        else {
                            scroller.style.transform = `translateY(-${distance}px)`;
                        }
                    }
                });
                hammer.on('panup', (event) => {

                });
                hammer.on('panend', () => {
                    scroller.style.removeProperty('transform');
                    moving = null;
                    this.element.style.touchAction = 'auto';
                });
            }
            else if (isIOS) {
                let start: number;
                this.element.addEventListener('touchstart', (event) => {
                    let rect = this.element.getBoundingClientRect();
                    console.log('start top:' + rect.top);
                    start = rect.top;
                })
                this.element.addEventListener('touchmove', (event) => {
                    // let rect = this.element.getBoundingClientRect();
                    // if ((rect.top - start) >= 0 && rect.top > 0) {
                    //     event.preventDefault();
                    // }
                    // console.log('move top:' + rect.top);
                    // event.stopPropagation();
                })
            }
        }

        render() {
            let children = getChildren(this.props);
            return (
                <section ref={(o: HTMLElement) => this.element = o} className={this.props.className} style={this.props.style}>
                    {children.map(o => (o))}
                </section>
            );
        }
    }
}