export default function (values: any) {
  return [
    {
      title: values['dashboard']['title'],
      children: [
        {
          title: values['dashboard']['analysis'],
          link: '/pages/dashboard/analysis',
        }
      ],
      link: '/pages/dashboard',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['management']['title'],
      children: [
        {
          title: values['management']['qlmh'],
          link: '/pages/management/qlmh',
        },
        {
          title: values['management']['qlhs'],
          link: '/pages/management/qlhs',
        },
        {
          title: values['management']['qlgv'],
          link: '/pages/management/qlgv',
        },
        {
          title: values['management']['qllh'],
          link: '/pages/management/qllh',
        },
        {
          title: values['management']['qlkh'],
          link: '/pages/management/qlkh',
        },
        {
          title: values['management']['qlld'],
          link: '/pages/management/qlld',
        },
        {
          title: values['management']['qldiem'],
          link: '/pages/management/qldiem',
        },
        {
          title: values['management']['qlnd'],
          link: '/pages/management/qlnd',
        }
      ],
      link: '/pages/management',
      menuIcon: 'icon icon-modify',
    }
  ];
}
